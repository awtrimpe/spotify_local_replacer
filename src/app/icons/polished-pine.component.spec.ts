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

  describe('should create', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
