import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { anyToString } from '../../core/utils';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

/** this is a dummy component, set up to do nothing deliberately. see the app-routing.module for more details. */
@Component({
  template: `
    @if (loading) {
      <div class="flex align-items-center justify-content-center w-full">
        <p-progress-spinner ariaLabel="loading" />
      </div>
    } @else {
      <h2>Login Failed</h2>
      <p>
        I do apologize, becasue you should never see this screen. The login for
        Spotify must have changed, and please let me know by opening a new Issue
        on GitHub if you do not see someone else has opened a similar Issue
        already.
        <a
          href="https://github.com/awtrimpe/spotify_local_replacer/issues"
          target="_blank"
        >
          GitHub Issues
        </a>
      </p>
    }
  `,
  standalone: true,
  imports: [ProgressSpinnerModule],
})
export class OAuthCallbackComponent implements OnInit {
  private authService = inject(AuthService);
  private msgService = inject(MessageService);
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  loading = true;

  ngOnInit(): void {
    this.route.queryParams?.subscribe((params) => {
      const code = params['code'];
      const state = this.storageService.getBrowser('state');
      if (code && state === params['state']) {
        this.getAccessToken(code);
      } else {
        this.msgService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Could not log into Spotify with application credentials.',
          life: 10000,
        });
        this.loading = false;
      }
    });
  }

  getAccessToken(code: string) {
    this.authService
      .getAccessToken(
        code,
        this.storageService.getBrowser('code_verifier') as string,
      )
      .subscribe({
        next: (resp) => {
          this.authService.setToken(resp.access_token);
          this.authService.setExpiration(Number(resp.expires_in));
          this.router.navigateByUrl(
            this.storageService.getBrowser('redirect') || '/',
          );
        },
        error: (err) => {
          this.msgService.add({
            severity: 'error',
            summary: 'Unable get access token from Spotify',
            detail: anyToString(err),
            life: 10000,
          });
          this.loading = false;
        },
      });
  }
}
