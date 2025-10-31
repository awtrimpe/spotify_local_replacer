import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PolishedPineComponent } from '../../icons/polished-pine.component';
import { AuthService } from '../../services/auth/auth.service';
import { LegalComponent } from '../legal/legal.component';

@Component({
  imports: [
    AccordionModule,
    ButtonModule,
    CommonModule,
    DialogModule,
    LegalComponent,
    RouterModule,
    PolishedPineComponent,
  ],
  templateUrl: `./home.component.html`,
})
export class HomeComponent implements OnInit {
  private authService = inject(AuthService);

  loggedIn = false;
  previouslyLoggedIn = false;
  openDialog = false;

  ngOnInit() {
    this.previouslyLoggedIn = this.authService.loggedInPreviously();
    this.loggedIn = this.authService.isLoggedIn();
  }
}
