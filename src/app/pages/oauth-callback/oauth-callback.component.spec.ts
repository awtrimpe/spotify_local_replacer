import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { OAuthCallbackComponent } from './oauth-callback.component';

class FakeAuthService {
  setToken() {
    return;
  }
  setExpiration() {
    return;
  }
  getAccessToken() {
    return of();
  }
}

describe('OAuthCallbackComponent', () => {
  let component: OAuthCallbackComponent;
  let fixture: ComponentFixture<OAuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthCallbackComponent],
      providers: [
        MessageService,
        { provide: AuthService, useClass: FakeAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '123' },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OAuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should call to get access token if code value and state value matches', () => {
      const code = 'secret code';
      const state = 'state hash';
      component['route'].queryParams = of({
        code,
        state,
      });
      spyOn(component['storageService'], 'getBrowser').and.returnValue(state);
      const getAccessTokenSpy = spyOn(component, 'getAccessToken');

      component.ngOnInit();

      expect(getAccessTokenSpy).toHaveBeenCalledWith(code);
      expect(component.loading).toBeTrue();
    });

    it('should open an error message on failure to get code', () => {
      component['route'].queryParams = of({
        error: 'Login failed',
      });
      const msgSpy = spyOn(component['msgService'], 'add');

      component.ngOnInit();

      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Login Failed',
        detail: 'Could not log into Spotify with application credentials.',
        life: 10000,
      });
      expect(component.loading).toBeFalse();
    });
  });

  describe('getAccessToken()', () => {
    it('should navigate with saved path on successful access token retrieval', () => {
      const routerSpy = spyOn(component['router'], 'navigateByUrl');
      const token = {
        access_token: 'abc123',
        token_type: 'Bearer',
        scope: 'read',
        expires_in: 2100,
        refresh_token: 'def456',
      };
      spyOn(component['authService'], 'getAccessToken').and.returnValue(
        of(token),
      );
      spyOn(component['authService'], 'setToken').and.callFake(() => {});
      spyOn(component['authService'], 'setExpiration').and.callFake(() => {});
      const path = '/path';
      spyOn(component['storageService'], 'getBrowser').and.returnValue(path);

      component.getAccessToken('code value');

      expect(component['authService'].setToken).toHaveBeenCalledWith(
        token.access_token,
      );
      expect(component['authService'].setExpiration).toHaveBeenCalledWith(
        token.expires_in,
      );
      expect(routerSpy).toHaveBeenCalledWith(path);
    });

    it('should set token and expiration and navigate to previous page', () => {
      const routerSpy = spyOn(component['router'], 'navigateByUrl');
      const token = {
        access_token: 'abc123',
        token_type: 'Bearer',
        scope: 'read',
        expires_in: 2100,
        refresh_token: 'def456',
      };
      spyOn(component['authService'], 'getAccessToken').and.returnValue(
        of(token),
      );
      spyOn(component['authService'], 'setToken').and.callFake(() => {});
      spyOn(component['authService'], 'setExpiration').and.callFake(() => {});

      component.getAccessToken('code value');

      expect(component['authService'].setToken).toHaveBeenCalledWith(
        token.access_token,
      );
      expect(component['authService'].setExpiration).toHaveBeenCalledWith(
        token.expires_in,
      );
      expect(routerSpy).toHaveBeenCalledWith('/');
    });

    it('should open an error messsage on failure to get access token', fakeAsync(() => {
      const routerSpy = spyOn(component['router'], 'navigateByUrl');
      spyOn(component['authService'], 'getAccessToken').and.returnValue(
        throwError(() => new Error('Bad error!')),
      );

      component.getAccessToken('code value');
      tick(1000);

      expect(component.loading).toBeFalse();
      expect(routerSpy).not.toHaveBeenCalled();
    }));
  });
});
