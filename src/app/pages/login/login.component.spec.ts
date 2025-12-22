import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { AuthService, spotifyAppInfo } from '../../services/auth/auth.service';
import { LoginComponent } from './login.component';

class FakeAuthService {
  isLoggedIn() {
    return true;
  }
  getToken() {
    return '';
  }
  getRedirectURI() {
    return '';
  }
  generateRandomString() {
    return '';
  }
  generateCodeChallenge() {
    return Promise.resolve();
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [{ provide: AuthService, useClass: FakeAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should run user through oauth if valid session', () => {
      const navSpy = spyOn(component['router'], 'navigate');

      component.ngOnInit();

      expect(navSpy).toHaveBeenCalledWith(['/oauth']);
    });

    it('should redirect user to Spotify login if not logged in', fakeAsync(() => {
      let str = '';
      component.window = {
        location: {
          replace: (point: string) => {
            str = point;
          },
        },
      } as any;
      const replaceSpy = spyOn(component.window.location, 'replace');
      spyOn(component['authService'], 'isLoggedIn').and.returnValue(false);
      const randomStr = 'randomString';
      const randomStr2 = 'randomString2';
      spyOn(component['authService'], 'generateRandomString').and.returnValues(
        randomStr,
        randomStr2,
      );
      const hash = 'jfisahf89sdf81';
      const genSpy = spyOn(
        component['authService'],
        'generateCodeChallenge',
      ).and.returnValue(Promise.resolve(hash));
      const saveBrowserSpy = spyOn(
        component['storageService'],
        'saveBrowser',
      ).and.callFake(() => {});

      component.ngOnInit();
      tick(1000);

      expect(genSpy).toHaveBeenCalledWith(randomStr);
      expect(replaceSpy.calls.first().args[0]).toContain(
        'https://accounts.spotify.com/authorize?' +
          `client_id=${spotifyAppInfo.clientID}` +
          '&response_type=code' +
          `&state=${randomStr2}` +
          '&scope=playlist-modify-public playlist-modify-private playlist-read-private playlist-read-collaborative' +
          '&code_challenge_method=S256' +
          `&code_challenge=${hash}` +
          '&redirect_uri=',
      );
      expect(saveBrowserSpy.calls.all()[0].args).toEqual([
        'code_verifier',
        randomStr,
      ]);
      expect(saveBrowserSpy.calls.all()[1].args).toEqual(['state', randomStr2]);
    }));
  });
});
