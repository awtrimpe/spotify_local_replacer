import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import SpotifyWebApi from 'spotify-web-api-js';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  imports: [
    AccordionModule,
    ButtonModule,
    CardModule,
    CommonModule,
    MessageModule,
    ProgressSpinnerModule,
    RouterModule,
  ],
  templateUrl: `./playlists.component.html`,
})
export class PlaylistComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private messageService: MessageService,
  ) {}

  sessionExp = false;
  spotify = new SpotifyWebApi();
  loading = false;
  playlists!: SpotifyApi.ListOfUsersPlaylistsResponse;

  ngOnInit() {
    this.spotify.setAccessToken(this.authService.getToken());
    const playlists = sessionStorage.getItem('playlists'); // TODO: Add refresh playlists option
    if (playlists) {
      this.playlists = JSON.parse(playlists);
    } else {
      this.loading = true;
      this.getUsersPlaylists();
    }
  }

  setTokenTimer() {
    const exp_time = this.authService.getExpiration() as Date;
    const timeout = exp_time.getTime() - new Date().getTime();
    setTimeout(() => {
      this.sessionExp = true;
      window.scrollTo(0, 0);
    }, timeout);
  }

  getUsersPlaylists() {
    this.spotify
      .getUserPlaylists()
      .then((resp) => {
        this.playlists = resp;
        sessionStorage.setItem('playlists', JSON.stringify(resp));
        this.loading = false;
      })
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to find any playlists',
          detail: err.toString(),
          life: 10000,
        });
        this.loading = false;
      });
  }
}
