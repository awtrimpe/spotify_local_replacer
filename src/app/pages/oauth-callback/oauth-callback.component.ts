import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

/** this is a dummy component, set up to do nothing deliberately. see the app-routing.module for more details. */
@Component({ template: '' })
export class OAuthCallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = new URLSearchParams(this.route.snapshot.fragment as string).get(
      'access_token',
    );
    const exp = new URLSearchParams(this.route.snapshot.fragment as string).get(
      'expires_in',
    );
    if (id) {
      this.authService.setToken(id);
      this.authService.setExpiration(Number(exp));
      this.router.navigateByUrl(sessionStorage.getItem('redirect') || '');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
