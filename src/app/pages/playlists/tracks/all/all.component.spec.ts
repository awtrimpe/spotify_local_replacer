import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { tracks } from '../../../../../test/tracks.spec';
import { AllTracksComponent } from './all.component';
import {
  PlaylistTrackSearchComponent,
  SearchSelection,
} from './search/search.component';

describe('AllTracksComponent', () => {
  let component: AllTracksComponent;
  let fixture: ComponentFixture<AllTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllTracksComponent],
      providers: [MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(AllTracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('findSelectedIndex()', () => {
    it('should emit the correct index when a track is selected', (done) => {
      component.tracks = tracks.items;
      component.offset = 200;
      component.trackSelected.subscribe((val) => {
        expect(val).toBe(202);
        done();
      });
      component.findSelectedIndex(tracks.items[2].track.id);
    });
  });

  describe('showSearch()', () => {
    it('should open the search component w/ the playlist ID', () => {
      const playlistID = 'abc123';
      const openSpy = spyOn(
        component['dialogService'],
        'open',
      ).and.callThrough();
      component.playlistID = playlistID;
      component.showSearch();
      expect(openSpy).toHaveBeenCalledWith(PlaylistTrackSearchComponent, {
        closable: true,
        dismissableMask: true,
        style: { width: '80%' },
        inputValues: { playlistID },
      });
    });

    it('should provide offset and index once tracks have been updated', () => {
      spyOn(component['dialogService'], 'open').and.returnValue({
        onClose: of({
          trackIndex: 7,
          trackID: 'ackk902482340',
        }),
      } as any);
      const nextSpy = spyOn(component.selectedSearchOffset, 'next');
      component.showSearch();
      expect(nextSpy).toHaveBeenCalledWith(0);
    });

    it('should to call findSelectedIndex until the parent has updated the tracks', fakeAsync(() => {
      const selection: SearchSelection = {
        trackIndex: 101,
        trackID: 'ackk902482340',
      };
      spyOn(component['dialogService'], 'open').and.returnValue({
        onClose: of(selection),
      } as any);
      const nextSpy = spyOn(component.selectedSearchOffset, 'next');
      const findSelectedIndexSpy = spyOn(component, 'findSelectedIndex');
      component.tracks = tracks.items;
      component.showSearch();
      expect(nextSpy).toHaveBeenCalledWith(100);
      expect(findSelectedIndexSpy).not.toHaveBeenCalled();
      const tracksCopy = JSON.parse(JSON.stringify(tracks.items));
      tracksCopy[0].track.id = selection.trackID;
      component.tracks = tracksCopy;
      tick(1000);
      expect(findSelectedIndexSpy).toHaveBeenCalledWith(selection.trackID);
    }));
  });
});
