import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from './app.component';

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
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute }],
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
