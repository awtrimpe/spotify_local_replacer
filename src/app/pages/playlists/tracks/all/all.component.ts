import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-all-tracks',
  imports: [
    ButtonModule,
    CardModule,
    CommonModule,
    FormsModule,
    RadioButtonModule,
    ScrollPanelModule,
  ],
  templateUrl: `./all.component.html`,
})
export class AllTracksComponent {
  @Input() tracks!: SpotifyApi.PlaylistTrackObject[];
  @Input() offset!: number;
  @Input() totalLength!: number;
  @Output() onSelect: EventEmitter<number> = new EventEmitter();
  selectedTrackID?: string;

  findSelectedIndex(
    track: SpotifyApi.TrackObjectFull | SpotifyApi.EpisodeObjectFull,
  ) {
    this.onSelect.emit(
      this.tracks.findIndex((trackA) => trackA.track === track) + this.offset,
    );
  }
}
