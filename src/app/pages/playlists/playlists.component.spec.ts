import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth/auth.service';
import { PlaylistComponent } from './playlists.component';

class FakeAuthService {
  getToken() {
    return '';
  }
  getExpiration() {
    return new Date();
  }
}

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaylistComponent],
      providers: [
        { provide: AuthService, useClass: FakeAuthService },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should ', () => {
      component.ngOnInit();
    });
  });
});
