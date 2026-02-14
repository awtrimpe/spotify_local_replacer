import { Component, inject } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { homeBreadcrumb, tools } from '../../../core/consts';
import { SpotifyService } from '../../../services/spotify/spotify.service';

@Component({
  selector: 'app-liked',
  template: `<p-breadcrumb [model]="crumbs" [home]="homeBreadcrumb" />

    <br />
    <div class="flex flex-column align-items-center">
      <p-button
        label="Begin Searching"
        [disabled]="loading"
        (onClick)="findMissingTracks()"
      />
      @if (loading) {
        <p-progress-spinner ariaLabel="loading" />
      }
    </div>
    @if (matches.length) {
      <p-table [value]="matches">
        <ng-template #header>
          <tr>
            <th>Artist</th>
            <th>Title</th>
            <th>Album</th>
            <th>Featured</th>
          </tr>
        </ng-template>
        <ng-template #body let-match>
          <tr>
            <td>{{ match.track.artists[0].name }}</td>
            <td>{{ match.track.name }}</td>
            <td>{{ match.track.album.name }}</td>
            <td>{{ match.track.artists[0].name }} []</td>
          </tr>
        </ng-template>
      </p-table>
    } `,
  imports: [BreadcrumbModule, ButtonModule, ProgressSpinnerModule, TableModule],
})
export class LikedComponent {
  private readonly msgService = inject(MessageService);
  private readonly spotifyService = inject(SpotifyService);

  crumbs: MenuItem[] = [
    {
      label: tools.liked.title,
    },
  ];
  homeBreadcrumb = homeBreadcrumb;
  loading = false;
  matches: SpotifyApi.SavedTrackObject[] = [];

  findMissingTracks() {
    this.loading = true;
    this.spotifyService
      .getLikedSongs()
      .then((resp) => {
        this.matches = resp.items;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.msgService.add({
          severity: 'error',
          summary: 'Failed to Retrieve Liked Tracks',
          detail:
            'We were unable to retrieve your Liked Songs from Spotify. Please try again later.',
          life: 10000,
        });
      });
  }
}
