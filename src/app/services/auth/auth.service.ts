import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SpotifyAccessTokenResp } from '../../models/auth.model';

export const spotifyAppInfo = {
  clientID: 'ceeaa79289664376bb1a3c271d97508c',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private token!: string;
  window = window;
  userDisplay = new BehaviorSubject<
    SpotifyApi.CurrentUsersProfileResponse | undefined
  >(undefined);

  getAccessToken(
    code: string,
    verifier: string,
  ): Observable<SpotifyAccessTokenResp> {
    let body = new HttpParams();
    body = body.set('grant_type', 'authorization_code');
    body = body.set('code', code);
    body = body.set('redirect_uri', this.getRedirectURI());
    body = body.set('client_id', spotifyAppInfo.clientID);
    body = body.set('code_verifier', verifier);
    return this.http.post<SpotifyAccessTokenResp>(
      'https://accounts.spotify.com/api/token',
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  refreshAccessToken(refreshToken: string): Observable<SpotifyAccessTokenResp> {
    let body = new HttpParams();
    body = body.set('grant_type', 'refresh_token');
    body = body.set('refresh_token', refreshToken);
    body = body.set('client_id', spotifyAppInfo.clientID);
    return this.http.post<SpotifyAccessTokenResp>(
      'https://accounts.spotify.com/api/token',
      body,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
  }

  generateRandomString(): string {
    const min = 43;
    const max = 128;
    const length = Math.floor(Math.random() * (max - min + 1) + min);
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], '');
  }

  generateCodeChallenge(plain: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data).then((val) => {
      return btoa(String.fromCharCode(...new Uint8Array(val)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    });
  }

  isLoggedIn(): boolean {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !this.isExpired()) {
      this.token = storedToken;
    }
    return this.token !== undefined && !this.isExpired();
  }

  setToken(val: string) {
    localStorage.setItem('token', val);
    this.token = val;
  }

  setExpiration(time: number) {
    const t = new Date();
    t.setSeconds(t.getSeconds() + time);
    localStorage.setItem('exp', t.toString());
  }

  isExpired(): boolean {
    const exp = this.getExpiration();
    if (exp) {
      return new Date() > exp;
    }
    return true;
  }

  getExpiration(): Date | null {
    const exp = localStorage.getItem('exp');
    if (exp) {
      return new Date(exp);
    }
    return null;
  }

  getToken(): string {
    return this.token;
  }

  setUserDisplay(display_val: SpotifyApi.CurrentUsersProfileResponse) {
    this.userDisplay.next(display_val);
  }

  loggedInPreviously(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getRedirectURI(): string {
    return (
      this.window.location.origin + environment.basepath + '/oauth-callback'
    );
  }
}
