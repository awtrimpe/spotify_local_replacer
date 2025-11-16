import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import SpotifyWebApi from 'spotify-web-api-js';
import { TrackCardComponent } from '../track-card/track-card.component';

@Component({
  selector: 'app-search',
  imports: [
    ButtonModule,
    CommonModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    TrackCardComponent,
  ],
  templateUrl: `./search.component.html`,
})
export class SearchComponent {
  private messageService = inject(MessageService);

  @Input() replaceTrack!: (
    match: SpotifyApi.TrackObjectFull,
    pos: number,
  ) => void;
  @Input() allPosition!: number;
  spotify = new SpotifyWebApi();
  @ViewChild('searchBox') searchBox!: ElementRef<HTMLInputElement>;
  searchMatches?: SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>;
  searchTimeout?: NodeJS.Timeout;
  searchLoading = false;

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

  clear() {
    this.searchMatches = undefined;
    if (this.searchBox && this.searchBox.nativeElement.value) {
      this.searchBox.nativeElement.value = '';
    }
  }
}
