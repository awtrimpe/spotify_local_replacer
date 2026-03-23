import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PopoverModule } from 'primeng/popover';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PlaylistComponent } from '../../../components/playlists/playlists.component';
import { TrackCardComponent } from '../../../components/track-card/track-card.component';
import { TrackLineTitlePipe } from '../../../pipes/track-line-title/track-line-title.pipe';
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
  templateUrl: `./playlist-tracks.component.html`,
  providers: [DialogService],
})
export class PlaylistTracksComponent implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly route = inject(ActivatedRoute);

  @Input() private readonly playlistID!: string;
  @Input() private readonly tracks!: SpotifyApi.PlaylistTrackObject[];
  @Input() private readonly offset!: number;
  @Input() private readonly totalLength!: number;
  @Output() private readonly trackSelected = new EventEmitter<number>();
  @Output() private readonly selectedSearchOffset = new EventEmitter<number>();
  private selectedTrackID?: string;
  private hoveredTrack?: SpotifyApi.TrackObjectFull;
  private dialogRef: DynamicDialogRef<PlaylistTrackSearchComponent> | null =
    null;
  private searchSelectionInterval?: NodeJS.Timeout;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.selectedPlaylist = playlists.items.find((playlist) => {
        return playlist.id === id;
      }) as SpotifyApi.PlaylistObjectSimplified;
    });
    const ref = this.dialogService.open(PlaylistComponent, {
      width: '90vw',
    })!;
    ref.onClose.subscribe((playlistID: string) => {
      console.log('You selected playlist: ', playlistID);
    });
  }

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
