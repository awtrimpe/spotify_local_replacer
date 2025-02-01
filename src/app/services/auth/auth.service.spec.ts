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
});
