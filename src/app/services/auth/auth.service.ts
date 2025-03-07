import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token!: string;
  userDisplay = new BehaviorSubject<
    SpotifyApi.CurrentUsersProfileResponse | undefined
  >(undefined);

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
}
