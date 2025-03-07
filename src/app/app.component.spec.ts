import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';

class FakeAuthService {
  userDisplay = new BehaviorSubject('');
}

const fakeActivatedRoute = {
  snapshot: {
    paramMap: {
      get(): string {
        return '123';
      },
    },
  },
};

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: AuthService, useClass: FakeAuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should observe clicks', () => {
    const event = new MouseEvent('click');
    const spy = spyOn(component, 'onClick');
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should not click menuBarRef if not in child of menu and on mobile', () => {
    const event = new MouseEvent('click');
    const spy = spyOn(
      component.menuBarRef.nativeElement.children[0].children[0],
      'click',
    );
    document.dispatchEvent(event);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should click menuBarRef if a child of menu and on mobile', () => {
    const event = new MouseEvent('click');
    component.menuBarRef.nativeElement.children[0].classList.add(
      'p-menubar-mobile-active',
    );
    const spy = spyOn(
      component.menuBarRef.nativeElement.children[0].children[0],
      'click',
    );
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  describe('ngOnInit()', () => {
    it('should subscribe to userDisplay value changes and set userDisplay to the returned value', () => {
      component.ngOnInit();
      const userDisplay = 'SWONDER';
      component['authService'].userDisplay.next(userDisplay);
      expect(component.userDisplay).toBe(userDisplay);
    });
  });

  describe('template tests', () => {
    it('should render title', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        compiled.querySelector('footer a')?.getAttribute('href'),
      ).toContain('github.com');
    });
  });
});
