import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import FuzzySearch from 'fuzzy-search';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SpotifyService } from '../../../../../services/spotify/spotify.service';

@Component({
  selector: 'all-playlist-track-search',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DataViewModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ProgressSpinnerModule,
  ],
  providers: [MessageService],
  template: `
    @if (!confirmed && allTracks.length === 0) {
      <p class="text-center">
        Loading tracks can take a while. Confirm you want to load all tracks to
        start the process.
      </p>
      <div class="flex justify-content-center">
        <p-button label="Load All Tracks" (onClick)="loadAllTracks()" />
      </div>
    } @else {
      <div class="flex justify-content-center">
        <div>
          <p-iconfield>
            <p-inputicon class="pi pi-search" />
            <input
              #searchField
              type="text"
              pInputText
              placeholder="Search"
              (keydown)="filterTracks(searchField.value)"
              [disabled]="loading"
            />
          </p-iconfield>
        </div>
      </div>

      <div class="flex justify-content-center">
        <p-dataview #dv [value]="searchMatches">
          <ng-template #list let-tracks>
            @for (track of tracks; track track.track.id) {
              <div
                [ngClass]="{
                  'border-none border-top-1 border-solid border-surface-200 dark:border-surface-700':
                    !$first,
                }"
              >
                <p>
                  <b>{{ track.track.album.artists[0].name }}</b>
                  - {{ track.track.name }}
                </p>
              </div>
            }
          </ng-template>
        </p-dataview>
      </div>
      @if (loading) {
        <p-progress-spinner ariaLabel="loading" class="m-0 h-3rem w-3rem" />
      }
    }
  `,
})
export class PlaylistTrackSearchComponent implements OnInit {
  private readonly messageService = inject(MessageService);
  private readonly spotifyService = inject(SpotifyService);

  @Input() playlistID!: string;

  confirmed = false;
  loading = false;
  allTracks: SpotifyApi.PlaylistTrackObject[] = [];
  searchMatches?: SpotifyApi.PlaylistTrackObject[];

  ngOnInit() {
    // TODO: Add auto-load if available
  }

  loadAllTracks() {
    this.confirmed = true;
    this.loading = true;

    this.spotifyService
      .getAllPlaylistTracks(this.playlistID)
      .then((tracks) => {
        this.allTracks = tracks;
        this.loading = false;
      })
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to Load Playlist Tracks',
          detail: err,
          life: 100000,
        });
        this.loading = false;
      });
  }

  filterTracks(val: string) {
    if (!val) {
      this.searchMatches = [];
      return;
    }
    const searcher = new FuzzySearch(
      this.allTracks,
      ['track.name', 'track.album', 'track.album.name', 'track.artists.name'],
      {
        caseSensitive: false,
        sort: true,
      },
    );
    this.allTracks.filter((track) => track.track);
    this.searchMatches = searcher.search(val);
  }
}
