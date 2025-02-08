import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ExpirationComponent } from './expiration.component';

class FakeAuthService {
  getExpiration() {
    return new Date();
  }
}

describe('ExpirationComponent', () => {
  let component: ExpirationComponent;
  let fixture: ComponentFixture<ExpirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpirationComponent],
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

    fixture = TestBed.createComponent(ExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should set timeout to difference between now and expiration time', () => {
      component.ngOnInit();
      expect(component.timeout).toBeDefined();
    });

    it('should scroll to top on expiration and set sessionExp to true', fakeAsync(() => {
      spyOn(component['authService'], 'getExpiration').and.returnValue(
        new Date(),
      );
      spyOn(window, 'scrollTo');
      const clearSpy = spyOn(window, 'clearTimeout');
      component.ngOnInit();
      tick(1000);
      expect(component.sessionExp).toBeTrue();
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      expect(clearSpy).toHaveBeenCalled();
    }));
  });
});
