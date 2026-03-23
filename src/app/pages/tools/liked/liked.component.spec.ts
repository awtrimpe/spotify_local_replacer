import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { likedSongs } from '../../../../test/tracks.spec';
import { LikedComponent } from './liked.component';

describe('LikedComponent', () => {
  let component: LikedComponent;
  let fixture: ComponentFixture<LikedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LikedComponent],
      providers: [MessageService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LikedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('findMissingTracks()', () => {
    it('should set matches to good response from Liked Songs', fakeAsync(() => {
      spyOn(component['spotifyService'], 'getLikedSongs').and.resolveTo(
        likedSongs,
      );
      component.findMissingTracks();
      tick();
      expect(component.matches).toEqual(likedSongs.items);
      expect(component.loading).toBeFalse();
    }));

    it('should open an error message on failure to load Liked Songs', fakeAsync(() => {
      spyOn(component['spotifyService'], 'getLikedSongs').and.rejectWith(
        'Bad!',
      );
      const msgSpy = spyOn(component['msgService'], 'add');
      component.findMissingTracks();
      tick();
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Failed to Retrieve Liked Tracks',
        detail:
          'We were unable to retrieve your Liked Songs from Spotify. Please try again later.',
        life: 10000,
      });
      expect(component.loading).toBeFalse();
    }));
  });
});
