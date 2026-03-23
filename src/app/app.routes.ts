import { Routes } from '@angular/router';
import { GuideComponent } from './pages/guide/guide.component';
import { HomeComponent } from './pages/home/home.component';
import { LegalComponent } from './pages/legal/legal.component';
import { LoginComponent } from './pages/login/login.component';
import { OAuthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';
import { LikedComponent } from './pages/tools/liked/liked.component';
import { LocalTracksComponent } from './pages/tools/local-tracks/local-tracks.component';
import { PlaylistTracksComponent } from './pages/tools/playlist-tracks/playlist-tracks.component';
import { ToolsComponent } from './pages/tools/tools.component';
import { AuthGuard } from './services/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'guide',
    component: GuideComponent,
  },
  {
    path: 'legal',
    component: LegalComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'oauth-callback',
    component: OAuthCallbackComponent,
  },
  {
    path: 'playlists',
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id/tracks',
        component: LocalTracksComponent,
      },
    ],
  },
  {
    path: 'tools',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: ToolsComponent,
      },
      {
        path: 'local-tracks',
        children: [
          {
            path: '',
            component: LocalTracksComponent,
          },
          {
            path: ':id',
            component: LocalTracksComponent,
          },
        ],
      },
      {
        path: 'playlist-tracks',
        children: [
          {
            path: '',
            component: PlaylistTracksComponent,
          },
          {
            path: ':id',
            component: PlaylistTracksComponent,
          },
        ],
      },
      {
        path: 'liked',
        component: LikedComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
