import { Pipe, PipeTransform } from '@angular/core';
import { Artist, PlaylistTrack } from '../models/spotify-track.model';

@Pipe({
  name: 'apptrackLineTitle',
  standalone: true,
})
export class TrackLineTitlePipe implements PipeTransform {
  transform(track: PlaylistTrack): string {
    // Track artist
    let title = track.track.artists[0].name;
    // Song title
    title += ` - ${track.track.name}`;
    // Featured artists
    if (track.track.artists.length > 1) {
      const artists: Artist[] = (
        JSON.parse(JSON.stringify(track.track.artists)) as Artist[]
      ).filter((artist) => !track.track.name.includes(artist.name));
      artists.shift();
      title +=
        (artists.length > 0 ? ' ft. ' : '') +
        artists.map((a) => a.name).join(', ');
    }
    return title;
  }
}
