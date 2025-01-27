import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

/**  Create the component */
@Component({
  template: `<h3>Redirecting to Spotify login</h3>`,
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

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
          window.location.origin + environment.basepath + '/oauth-callback',
        );
      window.location.replace(_endPoint);
      sessionStorage.setItem('redirect', this.route.snapshot.url.join('/'));
    } else {
      this.router.navigate(['/oauth']);
    }
  }
}
