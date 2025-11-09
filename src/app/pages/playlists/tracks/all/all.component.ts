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
import { PlaylistTrackSearchComponent } from './search/search.component';

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
  selectedTrackID?: string;
  hoveredTrack?: SpotifyApi.TrackObjectFull;
  dialogRef: DynamicDialogRef<PlaylistTrackSearchComponent> | null = null;

  findSelectedIndex(
    track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull,
  ) {
    this.trackSelected.emit(
      this.tracks.findIndex((trackA) => trackA.track === track) + this.offset,
    );
  }

  showSearch() {
    this.dialogRef = this.dialogService.open(PlaylistTrackSearchComponent, {
      closable: true,
      dismissableMask: true,
      style: { width: '80%' },
      inputValues: { playlistID: this.playlistID },
    });
  }
}
