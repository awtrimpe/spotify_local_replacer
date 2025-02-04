import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { OAuthCallbackComponent } from './oauth-callback.component';

class FakeAuthService {
  setToken() {
    return;
  }
  setExpiration() {
    return;
  }
}

describe('OAuthCallbackComponent', () => {
  let component: OAuthCallbackComponent;
  let fixture: ComponentFixture<OAuthCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OAuthCallbackComponent],
      providers: [
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
    it('should navigate to login if no ID found in URL', () => {
      const routerSpy = spyOn(component['router'], 'navigateByUrl');
      component['route'].snapshot.fragment = '';
      component.ngOnInit();
      expect(routerSpy).toHaveBeenCalledWith('/login');
    });

    it('should set token and expiration and navigate to previous page', () => {
      const routerSpy = spyOn(component['router'], 'navigateByUrl');
      component['route'].snapshot.fragment =
        '?access_token=123&expires_in=3600';
      const setTokenSpy = spyOn(component['authService'], 'setToken');
      const setExpirationSpy = spyOn(component['authService'], 'setExpiration');
      const prevURL = '/previous';
      spyOn(window.localStorage, 'getItem').and.returnValue(prevURL);
      component.ngOnInit();
      expect(routerSpy).toHaveBeenCalledWith(prevURL);
      expect(setTokenSpy).toHaveBeenCalledWith('123');
      expect(setExpirationSpy).toHaveBeenCalledWith(3600);
    });

    it('should set token and expiration and navigate to previous page', () => {
      const routerSpy = spyOn(component['router'], 'navigateByUrl');
      component['route'].snapshot.fragment =
        '?access_token=123&expires_in=3600';
      component.ngOnInit();
      expect(routerSpy).toHaveBeenCalledWith('/');
    });
  });
});
