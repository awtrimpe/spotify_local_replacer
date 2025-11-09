import { inject, Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private readonly spotify = new SpotifyWebApi();
  private readonly storageService = inject(StorageService);

  playlistTracks: { [key: string]: SpotifyApi.PlaylistTrackObject[] } = {};
  playlistTracksKey = 'playlistTracks';

  getAllPlaylistTracks(
    playlistID: string,
  ): Promise<SpotifyApi.PlaylistTrackObject[]> {
    // refactor: make the function async and handle storage JSON consistently
    return (async (): Promise<SpotifyApi.PlaylistTrackObject[]> => {
      const limit = 100;
      let offset = 0;
      let total = 0;

      try {
        const storedTracks = this.storageService.getBrowser(
          this.playlistTracksKey,
        );
        if (storedTracks) {
          try {
            this.playlistTracks = JSON.parse(storedTracks);
          } catch {}
        }

        if (this.playlistTracks[playlistID]) {
          console.log(playlistID);
          console.log(this.playlistTracks);
          return this.playlistTracks[playlistID];
        }

        // Fetch the first page to get the total count
        const firstResponse = await this.spotify.getPlaylistTracks(playlistID, {
          limit,
          offset,
        });
        total = firstResponse.total ?? firstResponse.items.length ?? 0;
        this.playlistTracks[playlistID] = [...firstResponse.items];

        offset += limit;

        // Fetch remaining pages
        while (offset < total) {
          const response = await this.spotify.getPlaylistTracks(playlistID, {
            limit,
            offset,
          });
          this.playlistTracks[playlistID] = [
            ...this.playlistTracks[playlistID],
            ...response.items,
          ];
          offset += limit;
        }

        this.storageService.saveBrowser(
          this.playlistTracksKey,
          this.playlistTracks,
        );

        return this.playlistTracks[playlistID];
      } catch (err) {
        throw new Error(
          `Failed to load tracks for ${playlistID} (offset ${offset}): ${String(
            err,
          )}`,
        );
      }
    })();
  }
}
