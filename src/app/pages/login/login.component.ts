import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

/**  Create the component */
@Component({
  template: `<h3>Redirecting to Spotify login</h3>`,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  window = window;

  /** The function executed on initialization */
  ngOnInit() {
    if (!this.authService.isLoggedIn()) {
      const _endPoint =
        'https://accounts.spotify.com/authorize?' +
        'client_id=ceeaa79289664376bb1a3c271d97508c' +
        '&response_type=token' +
        '&scope=playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative' +
        '&redirect_uri=' +
        encodeURIComponent(
          this.window.location.origin +
            environment.basepath +
            '/oauth-callback',
        );
      this.window.location.replace(_endPoint);
    } else {
      this.router.navigate(['/oauth']);
    }
  }
}
