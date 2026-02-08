import { Routes } from '@angular/router';
import { GuideComponent } from './pages/guide/guide.component';
import { HomeComponent } from './pages/home/home.component';
import { LegalComponent } from './pages/legal/legal.component';
import { LoginComponent } from './pages/login/login.component';
import { OAuthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';
import { PlaylistComponent } from './pages/playlists/playlists.component';
import { TracksComponent } from './pages/playlists/tracks/tracks.component';
import { LikedComponent } from './pages/tools/liked/liked.component';
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
    path: 'liked',
    component: LikedComponent,
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
        path: '',
        component: PlaylistComponent,
      },
      {
        path: ':id/tracks',
        component: TracksComponent,
      },
    ],
  },
  {
    path: 'tools',
    component: ToolsComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
