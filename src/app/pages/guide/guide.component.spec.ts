import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { GuideComponent } from './guide.component';

class FakeAuthService {
  getToken() {
    return '';
  }
}

describe('GuideComponent', () => {
  let component: GuideComponent;
  let fixture: ComponentFixture<GuideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, GuideComponent],
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

    fixture = TestBed.createComponent(GuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('template tests()', () => {
    it('should should include a router link to the playlists page', () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector('button').textContent).toContain(
        'Select Playlist',
      );
    });
  });
});
