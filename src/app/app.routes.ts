import { Routes } from '@angular/router';
import { GuideComponent } from './pages/guide/guide.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { OAuthCallbackComponent } from './pages/oauth-callback/oauth-callback.component';
import { PlaylistComponent } from './pages/playlists/playlists.component';
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
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'oauth-callback',
    component: OAuthCallbackComponent,
  },
  {
    path: 'playlists',
    component: PlaylistComponent,
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
