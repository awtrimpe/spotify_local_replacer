import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import SpotifyWebApi from 'spotify-web-api-js';
import { ExpirationComponent } from '../../../components/expiration/expiration.component';
import { SearchComponent } from '../../../components/search/search.component';
import { TrackCardComponent } from '../../../components/track-card/track-card.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AllTracksComponent } from './all/all.component';

@Component({
  imports: [
    AccordionModule,
    AllTracksComponent,
    ButtonModule,
    CardModule,
    CommonModule,
    DialogModule,
    ExpirationComponent,
    MenuModule,
    MessageModule,
    ProgressSpinnerModule,
    RouterModule,
    SearchComponent,
    TabsModule,
    TrackCardComponent,
  ],
  templateUrl: `./tracks.component.html`,
})
export class TracksComponent implements OnInit, AfterViewInit {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  sessionExp = false;
  spotify = new SpotifyWebApi();
  loading = false;
  // Dialog
  showDialog = false;
  // Selected Playlist's info
  selectedPlaylist!: SpotifyApi.PlaylistObjectSimplified;
  selectedPlaylistTotal?: number;
  // Selected Playlist's Track info
  tracks?: SpotifyApi.PlaylistTrackObject[];
  allTracks?: SpotifyApi.PlaylistTrackObject[];
  allPosition!: number;
  trackPos = 0;
  trackOffset = 0;
  trackJumpOptions?: MenuItem[];
  trackMatches?: SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>;
  // Search
  @ViewChild('searchComp') private searchComp!: SearchComponent;
  // Tab
  tabSelected = 0;

  ngOnInit() {
    this.spotify.setAccessToken(this.authService.getToken());
    this.setTokenTimer();
    this.getSelectedTab();
    const playlists: SpotifyApi.ListOfUsersPlaylistsResponse = JSON.parse(
      sessionStorage.getItem('playlists') as string,
    ); // TODO: Make this pull from sessionStorage only if not passed from playlist component
    if (!playlists) {
      this.router.navigate(['/playlists']);
    } else {
      this.route.params.subscribe((params) => {
        const id = params['id'];
        this.selectedPlaylist = playlists.items.find((playlist) => {
          return playlist.id === id;
        }) as SpotifyApi.PlaylistObjectSimplified;
      });
    }
  }

  ngAfterViewInit(): void {
    if (this.selectedPlaylist) {
      this.setPlaylist(this.selectedPlaylist);
    }
    this.cdr.detectChanges();
  }

  setTokenTimer() {
    const exp_time = this.authService.getExpiration() as Date;
    const timeout = exp_time.getTime() - new Date().getTime();
    setTimeout(() => {
      this.sessionExp = true;
      window.scrollTo(0, 0);
    }, timeout);
  }

  getSelectedTab() {
    const tab = sessionStorage.getItem('selectedTab');
    if (tab) {
      this.tabSelected = Number(tab);
    }
  }

  setTabSelected(num: number) {
    if (num !== this.tabSelected) {
      this.tabSelected = num;
      sessionStorage.setItem('selectedTab', num.toString());
    }
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
        this.selectedPlaylistTotal = resp.total || this.selectedPlaylistTotal!;
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
        if (
          this.tracks.length < 1 &&
          this.trackOffset + 100 < this.selectedPlaylistTotal &&
          this.tabSelected != 1
        ) {
          this.trackOffset += 100;
          this.setPlaylist(this.selectedPlaylist!);
        } else if (
          this.tracks.length < 1 &&
          this.trackOffset + 100 > this.selectedPlaylistTotal &&
          this.tabSelected != 1
        ) {
          this.showDialog = true;
        } else {
          if (this.tabSelected != 1) {
            this.findTrackMatches(this.tracks[this.trackPos]);
          }
        }
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
    this.searchComp.clear();
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

  next() {
    this.trackPos = this.trackPos + 1;
    this.findTrackMatches(this.tracks![this.trackPos]);
  }

  back() {
    // TODO Update to stop if no fewer tracks
    this.trackPos = this.allPosition % 100 === 0 ? 99 : this.trackPos - 1;
    this.findTrackMatches(
      (this.tracks as SpotifyApi.PlaylistTrackObject[])[this.trackPos],
    );
  }

  replaceTrack(track: SpotifyApi.TrackObjectFull, position: number) {
    this.loading = true;
    this.trackMatches = undefined;
    this.searchComp.clear();
    this.spotify
      .removeTracksFromPlaylistInPositions(
        this.selectedPlaylist!.id,
        [position],
        this.selectedPlaylist!.snapshot_id,
      )
      .then(() => {
        this.spotify
          .addTracksToPlaylist(this.selectedPlaylist!.id, [track.uri], {
            position,
          })
          .then(() => {
            if (this.tabSelected < 1) {
              this.trackPos++;
              this.findTrackMatches(this.tracks![this.trackPos]);
              this.loading = false;
            } else {
              this.loading = false;
              this.setPlaylist(this.selectedPlaylist!);
              this.messageService.add({
                severity: 'info',
                summary: 'Track successfully replaced.',
                detail: `${track.name} has replaced the previous track at position ${position} in the playlist`,
                life: 5000,
              });
            }
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
          detail: err?.response?.toString(),
          life: 10000,
        });
        this.loading = false;
      });
  }
}
