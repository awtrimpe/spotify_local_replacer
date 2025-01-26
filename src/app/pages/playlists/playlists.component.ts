import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import SpotifyWebApi from 'spotify-web-api-js';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  imports: [
    AccordionModule,
    ButtonModule,
    CardModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    ProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: `./playlists.component.html`,
})
export class PlaylistComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  sessionExp = false;
  spotify = new SpotifyWebApi();
  loading = false;
  playlists!: SpotifyApi.ListOfUsersPlaylistsResponse;
  // Selected Playlist's info
  selectedPlaylist?: SpotifyApi.PlaylistObjectSimplified;
  selectedPlaylistTotal?: number;
  // Selected Playlist's Track info
  tracks?: SpotifyApi.PlaylistTrackObject[];
  allTracks?: SpotifyApi.PlaylistTrackObject[];
  allPosition!: number;
  trackPos = 0;
  trackOffset = 0;
  trackJumpOptions?: MenuItem[];
  // Search info
  trackMatches?: SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>;
  @ViewChild('searchBox') searchBox!: ElementRef<HTMLInputElement>;
  searchMatches?: SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>;
  searchTimeout?: NodeJS.Timeout;
  searchLoading = false;

  ngOnInit() {
    this.spotify.setAccessToken(this.authService.getToken());
    const playlists = sessionStorage.getItem('playlists'); // TODO: Add refresh playlists option
    if (playlists) {
      this.playlists = JSON.parse(playlists);
    } else {
      this.loading = true;
      this.spotify
        .getUserPlaylists()
        .then((resp) => {
          this.playlists = resp;
          sessionStorage.setItem('playlists', JSON.stringify(resp));
          this.loading = false;
        })
        .catch((err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Unable to find any playlists',
            detail: err.toString(),
            life: 10000,
          });
          this.loading = false;
        });
    }
  }

  setTokenTimer() {
    const exp_time = this.authService.getExpiration() as Date;
    const timeout = exp_time.getTime() - new Date().getTime();
    setTimeout(() => {
      this.sessionExp = true;
      window.scrollTo(0, 0);
    }, timeout);
  }

  setPlaylist(playlist: SpotifyApi.PlaylistObjectSimplified) {
    this.selectedPlaylist = playlist;
    this.loading = true;
    this.spotify
      .getPlaylistTracks(playlist.id, {
        limit: 100,
        offset: this.trackOffset,
      })
      .then((resp) => {
        this.allTracks = resp.items;
        this.selectedPlaylistTotal = resp.total;
        this.trackJumpOptions = [];
        for (
          let i = 0;
          i < Math.floor(this.selectedPlaylistTotal / 100) + 1;
          i++
        ) {
          const val = i > 0 ? i * 100 : i;
          this.trackJumpOptions.push({
            label: val.toString(),
            command: () => {
              this.trackOffset = val;
              this.trackPos = 0;
              this.setPlaylist(this.selectedPlaylist!);
            },
          });
        }
        this.tracks = resp.items.filter((item) => {
          return item.is_local;
        });
        this.trackPos = 0;
        this.findTrackMatches(this.tracks[this.trackPos]);
        this.loading = false;
      })
      .catch((err: XMLHttpRequest) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to find playlist tracks',
          detail: err.response.toString(),
          life: 10000,
        });
        this.loading = false;
      });
  }

  findTrackMatches(track: SpotifyApi.PlaylistTrackObject) {
    this.searchMatches = undefined;
    if (track) {
      this.allPosition =
        this.allTracks!.indexOf(this.tracks![this.trackPos]) + this.trackOffset;
      this.loading = true;
      const artist = (track.track as SpotifyApi.TrackObjectFull).artists[0].name
        .split(/(feat)|(ft)/)[0]
        .trim();
      this.spotify
        .searchTracks(`${track.track.name} artist:${artist}`, {
          limit: 5,
        })
        .then((resp) => {
          this.trackMatches = resp.tracks;
          this.loading = false;
        })
        .catch((err: XMLHttpRequest) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Unable to find playlist tracks',
            detail: err.response.toString(),
            life: 10000,
          });
          this.loading = false;
        });
    } else {
      this.trackOffset += 100;
      this.setPlaylist(this.selectedPlaylist!);
    }
  }

  search(search: string) {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.searchLoading = true;
      this.spotify
        .searchTracks(search.trim(), {
          limit: 5,
        })
        .then((resp) => {
          this.searchMatches = resp.tracks;
          this.searchLoading = false;
        })
        .catch((err: XMLHttpRequest) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Unable to complete search tracks',
            detail: err.response.toString(),
            life: 10000,
          });
          this.searchLoading = false;
        });
    }, 2000);
  }

  replaceTrack(track: SpotifyApi.TrackObjectFull) {
    this.loading = true;
    this.trackMatches = this.searchMatches = undefined;
    if (this.searchBox && this.searchBox.nativeElement.value) {
      this.searchBox.nativeElement.value = '';
    }
    this.spotify
      .removeTracksFromPlaylistInPositions(
        this.selectedPlaylist!.id,
        [this.allPosition],
        this.selectedPlaylist!.snapshot_id,
      )
      .then(() => {
        this.spotify
          .addTracksToPlaylist(this.selectedPlaylist!.id, [track.uri], {
            position: this.allPosition,
          })
          .then(() => {
            this.trackPos++;
            this.findTrackMatches(this.tracks![this.trackPos]);
            this.loading = false;
          })
          .catch((err: XMLHttpRequest) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Unable to add track to playlist',
              detail: err.response.toString(),
              life: 10000,
            });
            this.loading = false;
          });
      })
      .catch((err: XMLHttpRequest) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to remove track from playlist',
          detail: err.response.toString(),
          life: 10000,
        });
        this.loading = false;
      });
  }
}
