import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CoffeeComponent } from '../../icons/coffee.component';
import { VenmoComponent } from '../../icons/venmo.component';

@Component({
  imports: [
    CoffeeComponent,
    ButtonModule,
    PanelModule,
    RouterModule,
    VenmoComponent,
  ],
  template: `
    <h1>Welcome to Local Track Replacer</h1>
    <p>
      This tool is designed to give full control to you in finding and replacing
      a playlist's local tracks within Spotify with a relevant match of your
      choosing. This application works as follows:
    </p>
    <ol>
      <li>
        Login to the application and grant permission to Local Spotify Replacer
      </li>
      <li>
        Select the playlist you would like to replace the local tracks inside
      </li>
      <li>
        One-by-One, access the recommendations for each track or search for a
        better match
      </li>
      <li>
        Replace the local track with a match of your choosing, or skip to the
        next track if there is not a Spotify match
      </li>
    </ol>
    <p>
      This tool is great for people who want to have full control of their
      playlists and ensure that each track is paired correctly.
    </p>
    <div class="w-full flex justify-content-center">
      <p-button
        label="Select Playlist"
        [rounded]="true"
        routerLink="/playlists"
      />
    </div>
    <br />
    <p-panel header="More Automation">
      <p class="m-0">
        If you are looking for a more automated solution, take a look at
        <a
          href="https://dersimn.github.io/spotify_local_track_matcher/"
          target="_blank"
          >Spotify Local Track Matcher</a
        >. I cannot vouch for its long-term support, but in my testing it well
        enough to save me time and then correct the few mistakes it made.
      </p>
    </p-panel>

    <h2>Support</h2>
    <div class="flex gap-2">
      <a pButton href="https://www.buymeacoffee.com/awtrimpe" target="_blank">
        <app-coffee></app-coffee> Buy Me a Coffee
      </a>
      <a
        pButton
        href="https://venmo.com/code?user_id=2183113648111616180&created=1737837195"
        target="_blank"
      >
        <app-venmo style="width: 1.7rem;"></app-venmo>Venmo
      </a>
    </div>
    <br />
    <a href="https://cash.app/$AlexTrimpe" target="_blank">
      <img
        src="./cash_app.png"
        alt="Cash App QR Code"
        class="sm:w-15rem max-w-full"
      />
    </a>

    <h2>Disconnecting from Local Track Replacer</h2>
    If you would like, you can disconnect your Spotify account from Local Track
    Replacer at any time by visiting
    <a target="_blank" href="https://www.spotify.com/us/account/apps/"
      >https://www.spotify.com/us/account/apps/</a
    >
    and selecting "Remove Access" from the Local Track Replacer app. Since we do
    not store any information about you on our servers, there is no further
    action required to disconnect. You may revisit our application and
    re-authorize the access permission at any time if you wish to use the
    application again.
  `,
})
export class GuideComponent {}
