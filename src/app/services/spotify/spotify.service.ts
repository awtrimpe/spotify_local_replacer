import { Injectable } from '@angular/core';
import SpotifyWebApi from 'spotify-web-api-js';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private readonly spotify = new SpotifyWebApi();

  playlistTracks: Record<string, SpotifyApi.PlaylistTrackObject[]> = {};
  playlistTracksKey = 'playlistTracks';

  /** Returns whether the tracks have already been  */
  playlistTracksInMemory(playlistID: string): boolean {
    return Object.keys(this.playlistTracks).includes(playlistID);
  }

  /** Retrieves all playlist tracks and returns once all have been fetched */
  getAllPlaylistTracks(
    playlistID: string,
  ): Promise<SpotifyApi.PlaylistTrackObject[]> {
    return (async (): Promise<SpotifyApi.PlaylistTrackObject[]> => {
      const limit = 100;
      let offset = 0;
      let total = 0;

      try {
        if (this.playlistTracksInMemory(playlistID)) {
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

        return this.playlistTracks[playlistID];
      } catch (err) {
        delete this.playlistTracks[playlistID];
        throw new Error(
          `Failed to load tracks for ${playlistID} (offset ${offset}): ${String(
            err,
          )}`,
        );
      }
    })();
  }

  // getAllLikedSongs() {
  //   this.spotify.getMySavedTracks({
  //     limit: 50
  //   })
  // }
}
