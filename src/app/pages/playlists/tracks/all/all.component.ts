import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopoverModule } from 'primeng/popover';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TrackCardComponent } from '../../../../components/track-card/track-card.component';
import { TrackLineTitlePipe } from '../../../../pipes/track-line-title/track-line-title.pipe';
import {
  PlaylistTrackSearchComponent,
  SearchSelection,
} from './search/search.component';

@Component({
  selector: 'app-all-tracks',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    PopoverModule,
    RadioButtonModule,
    ScrollPanelModule,
    TrackCardComponent,
    TrackLineTitlePipe,
  ],
  templateUrl: `./all.component.html`,
  providers: [DialogService],
})
export class AllTracksComponent {
  private readonly dialogService = inject(DialogService);

  @Input() playlistID!: string;
  @Input() tracks!: SpotifyApi.PlaylistTrackObject[];
  @Input() offset!: number;
  @Input() totalLength!: number;
  @Output() trackSelected = new EventEmitter<number>();
  @Output() selectedSearchOffset = new EventEmitter<number>();
  selectedTrackID?: string;
  hoveredTrack?: SpotifyApi.TrackObjectFull;
  dialogRef: DynamicDialogRef<PlaylistTrackSearchComponent> | null = null;
  searchSelectionInterval?: NodeJS.Timeout;

  findSelectedIndex(trackID: string) {
    this.trackSelected.emit(
      this.tracks.findIndex((track) => track.track.id === trackID) +
        this.offset,
    );
  }

  showSearch() {
    this.dialogRef = this.dialogService.open(PlaylistTrackSearchComponent, {
      closable: true,
      dismissableMask: true,
      style: { width: '80%' },
      inputValues: { playlistID: this.playlistID },
    });

    this.dialogRef!.onClose.subscribe((selected: SearchSelection) => {
      if (selected) {
        this.selectedSearchOffset.next(
          Math.floor(selected.trackIndex / 100) * 100,
        );
        // It takes a moment for the track component to change the offset & provide the new tracks
        this.searchSelectionInterval = setInterval(() => {
          if (this.tracks?.find((t) => t.track.id === selected.trackID)) {
            this.selectedTrackID = selected.trackID;
            this.findSelectedIndex(selected.trackID);
            clearInterval(this.searchSelectionInterval);
          }
        }, 1000);
      }
    });
  }
}
