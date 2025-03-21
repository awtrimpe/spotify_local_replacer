import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-expiration',
  imports: [ButtonModule, CommonModule, MessageModule, RouterModule],
  template: `
    <p-message *ngIf="sessionExp" severity="error">
      <b>Session Expired:</b> Please login again. Your information will not be
      carried over so take note of your current position if you are not
      finished.
      <p-button routerLink="/login" rounded="true" label="Login" />
    </p-message>
  `,
})
export class ExpirationComponent implements OnInit {
  constructor(private authService: AuthService) {}

  sessionExp = false;
  timeout?: NodeJS.Timeout;

  ngOnInit() {
    const exp_time = this.authService.getExpiration() as Date;
    const timeout = Math.floor(exp_time.getTime() - new Date().getTime());
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.sessionExp = true;
      window.scrollTo(0, 0);
    }, timeout);
  }
}
