import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
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
});
