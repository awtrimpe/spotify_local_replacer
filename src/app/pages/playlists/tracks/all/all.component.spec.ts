import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { tracks } from '../../../../../test/tracks.spec';
import { AllTracksComponent } from './all.component';

describe('AllTracksComponent', () => {
  let component: AllTracksComponent;
  let fixture: ComponentFixture<AllTracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, AllTracksComponent],
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
      component.findSelectedIndex(tracks.items[2].track);
    });
  });
});
