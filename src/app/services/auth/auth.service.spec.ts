import { HttpParams, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { userInfo } from '../../../test/user.spec';
import { AuthService, spotifyAppInfo } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
  });

  describe('getAccesToken()', () => {
    it('should call the Spotify API to retrieve an access token with the proper payload', (done) => {
      const resp = {
        access_token: 'abc123',
        token_type: 'Bearer',
        scope: 'read',
        expires_in: 2100,
        refresh_token: 'def456',
      };
      const httpSpy = spyOn(service['http'], 'post').and.returnValue(of(resp));
      const code = 'abc1213';
      const verifier = '09sjdfu9sf8';
      let body = new HttpParams();
      body = body.set('grant_type', 'authorization_code');
      body = body.set('code', code);
      body = body.set('redirect_uri', service.getRedirectURI());
      body = body.set('client_id', spotifyAppInfo.clientID);
      body = body.set('code_verifier', verifier);

      service.getAccessToken(code, verifier).subscribe({
        next: (val) => {
          expect(httpSpy).toHaveBeenCalledWith(
            'https://accounts.spotify.com/api/token',
            body,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );
          expect(val).toBe(resp);
          done();
        },
      });
    });
  });

  describe('refreshAccessToken()', () => {
    it('should call the Spotify API to retrieve a refresh token with the proper payload', (done) => {
      const resp = {
        access_token: 'abc123',
        token_type: 'Bearer',
        scope: 'read',
        expires_in: 2100,
        refresh_token: 'def456',
      };
      const httpSpy = spyOn(service['http'], 'post').and.returnValue(of(resp));
      const token = 'ey09adi09j';
      let body = new HttpParams();
      body = body.set('grant_type', 'refresh_token');
      body = body.set('refresh_token', token);
      body = body.set('client_id', spotifyAppInfo.clientID);

      service.refreshAccessToken(token).subscribe({
        next: (val) => {
          expect(httpSpy).toHaveBeenCalledWith(
            'https://accounts.spotify.com/api/token',
            body,
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            },
          );
          expect(val).toBe(resp);
          done();
        },
      });
    });
  });

  describe('generateRandomString()', () => {
    it('should generate a string of ', () => {
      const str = service.generateRandomString();

      expect(str.length).toBeLessThanOrEqual(128);
      expect(str.length).toBeGreaterThanOrEqual(43);
      expect(new RegExp('^[a-zA-Z0-9]+$').test(str)).toBeTrue();
    });
  });

  describe('generateCodeChallenge()', () => {
    it('should return a base64 encoded string', (done) => {
      const a = 'My secret random string';

      service.generateCodeChallenge(a).then((val) => {
        expect(val).not.toEqual(a);
        expect(val).toBe('KqxS9TbT4z0G_b7LgGNCzX4ZXs4idSrdWiAoLOAMOrs');
        done();
      });
    });
  });

  describe('isLoggedIn()', () => {
    it('should return true if the user is logged in', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue('abc123');
      spyOn(service, 'isExpired').and.returnValue(false);
      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false if the token is not present', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false if the token is present but expired', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue('abc123');
      spyOn(service, 'isExpired').and.returnValue(true);
      expect(service.isLoggedIn()).toBeFalse();
    });
  });

  describe('setToken()', () => {
    it('should set token with passed value', () => {
      const localSpy = spyOn(window.localStorage, 'setItem');
      const value = 'abc123';
      service.setToken(value);
      expect(localSpy).toHaveBeenCalledWith('token', value);
    });
  });

  describe('setExpiration()', () => {
    it('should set expiration time with current time plus passed seconds', () => {
      const localSpy = spyOn(window.localStorage, 'setItem');
      const value = 3600;
      service.setExpiration(value);
      const date = new Date();
      date.setSeconds(date.getSeconds() + value);
      expect(localSpy).toHaveBeenCalledWith('exp', date.toString());
    });
  });

  describe('isExpired()', () => {
    it('should return true if the expiration is in the past', () => {
      const t = new Date();
      t.setSeconds(t.getSeconds() - 1000);
      spyOn(service, 'getExpiration').and.returnValue(t);
      expect(service.isExpired()).toBeTrue();
    });

    it('should return false if the expiration is in the future', () => {
      const t = new Date();
      t.setSeconds(t.getSeconds() + 1000);
      spyOn(service, 'getExpiration').and.returnValue(t);
      expect(service.isExpired()).toBeFalse();
    });

    it('should return true if no value set', () => {
      spyOn(service, 'getExpiration').and.returnValue(null);
      expect(service.isExpired()).toBeTrue();
    });
  });

  describe('getExpiration()', () => {
    it('should return the expiration date if set', () => {
      const t = new Date();
      spyOn(window.localStorage, 'getItem').and.returnValue(t.toString());
      expect(service.getExpiration()?.toString()).toEqual(t.toString());
    });

    it('should return null if no date set', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      expect(service.getExpiration()).toBeNull();
    });
  });

  describe('getToken()', () => {
    it('should return the global variable token', () => {
      const token = 'abc123';
      service['token'] = token;
      expect(service.getToken()).toBe(token);
    });
  });

  describe('setUserDisplay()', () => {
    it('should call next on userDisplay with passed value', () => {
      spyOn(service.userDisplay, 'next');
      service.setUserDisplay(userInfo);
      expect(service.userDisplay.next).toHaveBeenCalledWith(userInfo);
    });
  });

  describe('loggedInPreviously()', () => {
    it('should return true if a token is known', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue('abc123');
      expect(service.loggedInPreviously()).toBeTrue();
    });

    it('should return false if no token', () => {
      spyOn(window.localStorage, 'getItem').and.returnValue(null);
      expect(service.loggedInPreviously()).toBeFalse();
    });
  });

  describe('getRedirectURI()', () => {
    it('should return a proper return URI based on the window location and environment', () => {
      const origin = 'https://mydomain.co';
      service['window'] = {
        location: {
          origin,
        },
      } as any;

      expect(service.getRedirectURI()).toEqual(
        `${origin}${environment.basepath}/oauth-callback`,
      );
    });
  });
});
