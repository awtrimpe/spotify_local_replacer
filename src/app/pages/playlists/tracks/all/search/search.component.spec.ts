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
});
