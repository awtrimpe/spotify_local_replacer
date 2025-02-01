import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

class FakeAuthService {
  isLoggedIn() {
    return true;
  }
}

describe('AuthGuard', () => {
  let service: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: FakeAuthService },
        AuthGuard,
      ],
    });

    service = TestBed.inject(AuthGuard);
  });

  describe('canActivate()', () => {
    it('should return true if the user is logged in', () => {
      expect(service.canActivate({} as any, {} as any)).toBeTrue();
    });

    it('should set redirect if user not logged in', () => {
      const storageSpy = spyOn(window.localStorage, 'setItem');
      spyOn(service['authService'], 'isLoggedIn').and.returnValue(false);
      const routerSpy = spyOn(service['router'], 'navigateByUrl');
      const url = '/redirect-to-me';
      expect(service.canActivate({} as any, { url } as any)).toBeFalse();
      expect(storageSpy).toHaveBeenCalledWith('redirect', url);
      expect(routerSpy).toHaveBeenCalledWith('/login');
    });
  });
});
