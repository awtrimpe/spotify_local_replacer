import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token!: string;

  isLoggedIn(): boolean {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !this.isExpired()) {
      this.token = storedToken;
    }
    return this.token !== undefined;
  }

  setToken(val: string) {
    localStorage.setItem('token', val);
    this.token = val;
  }

  setExpiration(time: number) {
    const t = new Date();
    t.setSeconds(t.getSeconds() + time);
    localStorage.setItem('exp', t.toDateString());
  }

  isExpired(): boolean {
    const exp = localStorage.getItem('exp');
    if (exp) {
      return new Date() > new Date(exp);
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
}
