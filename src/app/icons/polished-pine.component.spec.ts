import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PolishedPineComponent } from './polished-pine.component';

describe('PolishedPineComponent', () => {
  let component: PolishedPineComponent;
  let fixture: ComponentFixture<PolishedPineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolishedPineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PolishedPineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should create', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should set styling', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(
        getComputedStyle(compiled.querySelector('svg') as SVGSVGElement).fill,
      ).toBe('rgb(255, 163, 62)');
    });
  });
});
