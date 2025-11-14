import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Fuse from 'fuse.js';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TrackLineTitlePipe } from '../../../../../pipes/track-line-title.pipe';
import { SpotifyService } from '../../../../../services/spotify/spotify.service';

export interface SearchSelection {
  trackIndex: number;
  trackID: string;
}

@Component({
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    TableModule,
    TrackLineTitlePipe,
  ],
  providers: [MessageService],
  template: `
    @if (!confirmed && allTracks.length === 0) {
      <p class="text-center">
        If you have a large playlist, loading tracks can take a while. Confirm
        you want to load all tracks before beginning.
      </p>
      <div class="flex justify-content-center">
        <p-button label="Load All Tracks" (onClick)="loadAllTracks()" />
      </div>
    } @else {
      <div class="flex justify-content-center">
        <div class="max-w-full">
          <p-iconfield>
            <p-inputicon class="pi pi-search" />
            <input
              #searchField
              [formControl]="search"
              type="text"
              pInputText
              placeholder="Search"
              class="max-w-full"
              [disabled]="loading"
            />
          </p-iconfield>
        </div>
      </div>

      <div class="flex justify-content-center">
        <!-- User search results -->
        @if (
          searchField.value.length > 0 &&
          searchMatches &&
          searchMatches.length > 1
        ) {
          <p-table [value]="searchMatches || []" [paginator]="true" [rows]="5">
            <ng-template #body let-track>
              <tr>
                <td>
                  {{ track | apptrackLineTitle }}
                </td>
                <td>
                  <p-button
                    label="Select"
                    severity="info"
                    rounded="true"
                    (onClick)="findIndexOfSelected(track)"
                  />
                </td>
              </tr>
            </ng-template>
          </p-table>
        } @else if (
          searchField.value.length > 0 &&
          searchMatches &&
          searchMatches.length < 1
        ) {
          <p>No results found</p>
        } @else if (!loading) {
          <p>Begin seaching to find matching tracks in your playlist</p>
        }
      </div>
      @if (loading) {
        <div class="flex justify-content-center">
          <p-progress-spinner ariaLabel="loading" class="m-0 h-3rem w-3rem" />
        </div>
      }
    }
  `,
})
export class PlaylistTrackSearchComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ref = inject(DynamicDialogRef);
  private readonly messageService = inject(MessageService);
  private readonly spotifyService = inject(SpotifyService);

  @Input() playlistID!: string;

  confirmed = false;
  loading = false;
  allTracks: SpotifyApi.PlaylistTrackObject[] = [];
  searchMatches?: SpotifyApi.PlaylistTrackObject[];
  search = new FormControl('');

  ngOnInit() {
    if (this.spotifyService.playlistTracksInMemory(this.playlistID)) {
      this.loadAllTracks();
    }
    this.search.valueChanges.subscribe((val) => {
      this.filterTracks(val);
    });
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

  filterTracks(val: string | null) {
    if (!val) {
      this.searchMatches = [];
      return;
    }

    const searcher = new Fuse(this.allTracks, {
      keys: [
        'track.name',
        'track.album',
        'track.album.name',
        'track.artists.name',
      ],
    });
    this.searchMatches = searcher
      .search(val.trim().toLocaleLowerCase())
      .map((m) => m.item);
    this.cdr.detectChanges();
  }

  findIndexOfSelected(selected: SpotifyApi.PlaylistTrackObject) {
    this.ref.close({
      trackIndex: this.allTracks.indexOf(selected),
      trackID: selected.track.id,
    } as SearchSelection);
  }
}
