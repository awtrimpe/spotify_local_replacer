import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolishedPineComponent } from './polished-pine.component';

describe('PolishedPineComponent', () => {
  let component: PolishedPineComponent;
  let fixture: ComponentFixture<PolishedPineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PolishedPineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PolishedPineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should call setThemeColors', () => {
      const themeSpy = spyOn(component, 'setThemeColors');
      component.ngOnInit();
      expect(themeSpy).toHaveBeenCalled();
    });
  });

  describe('setThemeColors()', () => {
    it('should set styling fill to white if dark theme', () => {
      spyOn(window, 'matchMedia').and.returnValue({
        matches: true,
        addListener: () => {},
        removeListener: () => {},
      } as any as MediaQueryList);
      component.setThemeColors();
      expect(component.styling.fill).toBe('#FFF');
    });
  });
});
