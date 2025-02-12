import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth/auth.service';
import { LoginComponent } from './login.component';

class FakeAuthService {
  isLoggedIn() {
    return true;
  }
  getToken() {
    return '';
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

    it('should redirect user to Spotify login if not logged in', () => {
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
      component.ngOnInit();
      expect(replaceSpy.calls.first().args[0]).toContain(
        'accounts.spotify.com',
      );
    });
  });
});
