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
import { ExpirationComponent } from '../../components/expiration/expiration.component';
import { SpotifyComponent } from '../../icons/spotify.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  imports: [
    AccordionModule,
    ButtonModule,
    CardModule,
    CommonModule,
    ExpirationComponent,
    MessageModule,
    ProgressSpinnerModule,
    RouterModule,
    SpotifyComponent,
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

  getUsersPlaylists() {
    this.loading = true;
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
