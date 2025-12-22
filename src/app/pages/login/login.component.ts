import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, spotifyAppInfo } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

/**  Create the component */
@Component({
  template: `<h3>Redirecting to Spotify login</h3>`,
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly storageService = inject(StorageService);
  private readonly router = inject(Router);

  window = window;

  /** The function executed on initialization */
  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      const verifier = this.authService.generateRandomString();
      this.authService.generateCodeChallenge(verifier).then((val) => {
        this.storageService.saveBrowser('code_verifier', verifier);
        const state = this.authService.generateRandomString();
        this.storageService.saveBrowser('state', state);
        const _endPoint =
          'https://accounts.spotify.com/authorize?' +
          `client_id=${spotifyAppInfo.clientID}` +
          '&response_type=code' +
          `&state=${state}` +
          '&scope=playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative' +
          '&code_challenge_method=S256' +
          `&code_challenge=${val}` +
          '&redirect_uri=' +
          encodeURIComponent(this.authService.getRedirectURI());
        this.window.location.replace(_endPoint);
      });
    } else {
      this.router.navigate(['/oauth']);
    }
  }
}
