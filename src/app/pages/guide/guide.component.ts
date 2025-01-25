import { Component } from '@angular/core';
import { PanelModule } from 'primeng/panel';

@Component({
  imports: [PanelModule],
  template: `
    <h1>Welcome to Spotify Local Replacer</h1>
    <p>
      This tool is designed to give full control to you in finding and replacing
      local tracks added to Spotify with a relevant match of your choosing. This
      application works as follows:
    </p>
    <ol>
      <li>
        Login to the application and grant permission to Spotify Local Replacer
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
    <p-panel header="More Automation">
      <p class="m-0">
        If you are looking for a more automated solution, I recommend taking a
        look at
        <a
          href="https://dersimn.github.io/spotify_local_track_matcher/"
          target="_blank"
          >Spotify Local Track Matcher</a
        >. I cannot vouch for its long-term support, but in my testing it
        performed very well.
      </p>
    </p-panel>
  `,
})
export class GuideComponent {}
