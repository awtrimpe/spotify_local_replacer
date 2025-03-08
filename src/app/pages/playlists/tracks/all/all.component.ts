import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TrackCardComponent } from '../../../../components/track-card/track-card.component';

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
})
export class AllTracksComponent {
  @Input() tracks!: SpotifyApi.PlaylistTrackObject[];
  @Input() offset!: number;
  @Input() totalLength!: number;
  @Output() trackSelected = new EventEmitter<number>();
  selectedTrackID?: string;
  hoveredTrack?: SpotifyApi.TrackObjectFull;

  findSelectedIndex(
    track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull,
  ) {
    this.trackSelected.emit(
      this.tracks.findIndex((trackA) => trackA.track === track) + this.offset,
    );
  }
}
