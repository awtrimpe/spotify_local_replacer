import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { tracks } from '../../../../../../test/tracks.spec';
import { TrackLineTitlePipe } from '../../../../../pipes/track-line-title.pipe';
import { PlaylistTrackSearchComponent } from './search.component';

describe('PlaylistTrackSearchComponent', () => {
  let component: PlaylistTrackSearchComponent;
  let fixture: ComponentFixture<PlaylistTrackSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ButtonModule,
        CommonModule,
        FormsModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ProgressSpinnerModule,
        ReactiveFormsModule,
        TableModule,
        TrackLineTitlePipe,
      ],
      providers: [DynamicDialogRef, MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistTrackSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    it('should check if tracks already in memory and call if true', () => {
      spyOn(
        component['spotifyService'],
        'playlistTracksInMemory',
      ).and.returnValue(true);
      const loadAllTracksSpy = spyOn(component, 'loadAllTracks');
      component.ngOnInit();
      expect(loadAllTracksSpy).toHaveBeenCalled();
    });

    it('should call filterTracks on search field value change', fakeAsync(() => {
      const filterTracksSpy = spyOn(component, 'filterTracks');
      component.ngOnInit();
      const searchStr = 'Hello World!';
      component.search.setValue(searchStr);
      tick(1000);
      expect(filterTracksSpy).toHaveBeenCalledWith(searchStr);
    }));
  });

  describe('loadAllTracks()', () => {
    it('should set all tracks to the returned value', fakeAsync(() => {
      spyOn(component['spotifyService'], 'getAllPlaylistTracks').and.resolveTo(
        tracks.items,
      );
      component.loadAllTracks();
      tick(1000);
      expect(component.allTracks).toEqual(tracks.items);
      expect(component.loading).toBeFalse();
    }));

    it('should open a message on error', fakeAsync(() => {
      const msgSpy = spyOn(component['messageService'], 'add');
      const errMsg = 'Error!';
      spyOn(component['spotifyService'], 'getAllPlaylistTracks').and.rejectWith(
        errMsg,
      );
      component.loadAllTracks();
      tick(1000);
      expect(component.loading).toBeFalse();
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Failed to Load Playlist Tracks',
        detail: errMsg,
        life: 100000,
      });
    }));
  });

  describe('filterTracks()', () => {
    it('should not execute search if no value provided', () => {
      const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');
      component.filterTracks('');
      expect(detectChangesSpy).not.toHaveBeenCalled();
    });

    it('should reduce the track length to only matched items', () => {
      const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');
      component.allTracks = tracks.items;
      component.filterTracks(tracks.items[0].track.name);
      expect(detectChangesSpy).toHaveBeenCalled();
      expect(component.searchMatches!.length).toBeGreaterThan(0);
      expect(component.searchMatches!.length).toBeLessThan(tracks.items.length);
    });
  });

  describe('selectTrack', () => {
    it('should call to close with the selected track', () => {
      component.allTracks = tracks.items;
      const index = 2;
      const closeSpy = spyOn(component['ref'], 'close');
      component.selectTrack(tracks.items[index]);
      expect(closeSpy).toHaveBeenCalledWith({
        trackIndex: index,
        trackID: tracks.items[index].track.id,
      });
    });
  });
});
