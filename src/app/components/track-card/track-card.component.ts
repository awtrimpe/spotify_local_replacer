import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SpotifyComponent } from '../../icons/spotify.component';

@Component({
  selector: 'app-track-card',
  imports: [ButtonModule, CardModule, CommonModule, SpotifyComponent],
  template: `
    <p-card class="w-20rem align-items-stretch full-height-card" *ngIf="track">
      <ng-template #header>
        <div class="w-4 mt-3 m-auto">
          <app-spotify />
        </div>
        <a
          class="p-card-title mx-3 text-primary"
          [ngClass]="{
            disabledLink: !track.external_urls.spotify,
          }"
          [href]="track.external_urls.spotify"
          target="_blank"
          >{{ track.name }}</a
        >
      </ng-template>
      <div class="flex justify-content-between flex-column h-full">
        <div>
          <div
            class="m-auto"
            style="width: 10em"
            *ngIf="track.album && track.album.images && track.album.images[0]"
          >
            <img
              [src]="track.album.images[0].url"
              class="w-full"
              alt="{{ track.album.name }} image"
            />
          </div>
          <p>
            <b>Artist:</b>
            <a
              class="text-primary"
              [ngClass]="{
                disabledLink: !track.artists[0].external_urls.spotify,
              }"
              [href]="track.artists[0].external_urls.spotify"
              target="_blank"
              >{{ track.artists[0].name }}</a
            >
            <ng-container *ngIf="track.artists.length > 1">
              ft.
              <ng-container
                *ngFor="let artist of track.artists; first as isFirst"
              >
                <ng-container *ngIf="!isFirst">
                  {{ artist.name }}
                </ng-container>
              </ng-container>
            </ng-container>
          </p>
          <p>
            <b>Album:</b
            ><a
              class="text-primary"
              [ngClass]="{
                disabledLink: !track.album.external_urls.spotify,
              }"
              [href]="track.album.external_urls.spotify"
              target="_blank"
            >
              {{ track.album.name }}</a
            >
          </p>
          <p><b>Year:</b> {{ $any(track.album).release_date }}</p>
          <p><b>Explicit:</b> {{ $any(track).explicit }}</p>
        </div>
        <div
          class="flex flex-column align-items-center mt-2"
          *ngIf="replaceable"
        >
          <hr class="w-full" />
          <p-button [rounded]="true" (click)="selectedTrack.next(track)">
            Select
          </p-button>
        </div>
      </div>
    </p-card>
  `,
})
export class TrackCardComponent {
  @Input() track!: SpotifyApi.TrackObjectFull;
  @Input() replaceable = false;
  @Output() selectedTrack = new EventEmitter<SpotifyApi.TrackObjectFull>();
}
