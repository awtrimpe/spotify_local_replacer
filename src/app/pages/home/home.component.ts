import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PolishedPineComponent } from '../../icons/polished-pine.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  imports: [ButtonModule, CommonModule, RouterModule, PolishedPineComponent],
  templateUrl: `./home.component.html`,
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  loggedIn = false;

  ngOnInit() {
    this.loggedIn = this.authService.isLoggedIn();
  }
}
