import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

/** this is a dummy component, set up to do nothing deliberately. see the app-routing.module for more details. */
@Component({ template: '' })
export class OAuthCallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    const id = new URLSearchParams(this.route.snapshot.fragment as string).get(
      'access_token',
    );
    const exp = new URLSearchParams(this.route.snapshot.fragment as string).get(
      'expires_in',
    );
    if (id && exp) {
      this.authService.setToken(id);
      this.authService.setExpiration(Number(exp));
      const prevUrl = localStorage.getItem('redirect');
      this.router.navigateByUrl(prevUrl ? prevUrl : '/');
    } else {
      this.router.navigateByUrl('/login');
    }
  }
}
