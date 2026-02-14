import { cloneDeep } from 'lodash';
import { tracks } from '../../../test/tracks.spec';
import { PlaylistTrack } from '../../models/spotify-track.model';
import { TrackLineTitlePipe } from './track-line-title.pipe';

describe('TrackLineTitlePipe', () => {
  let pipe: TrackLineTitlePipe;

  beforeEach(() => {
    pipe = new TrackLineTitlePipe();
  });

  describe('transform()', () => {
    it('should return artist with track name', () => {
      expect(pipe.transform(tracks.items[0] as PlaylistTrack)).toBe(
        '¡MAYDAY! - Believers',
      );
    });

    it('should not add artist`s name if already present in track title', () => {
      expect(pipe.transform(tracks.items[1] as PlaylistTrack)).toBe(
        `T-Pain - 5 O'Clock (feat. Lily Allen & Wiz Khalifa)`,
      );
    });

    it('should return artists separated by an ampersand', () => {
      const track = cloneDeep(tracks.items[1]) as PlaylistTrack;
      track.track.name = `5 O'Clock`;
      expect(pipe.transform(track)).toBe(
        `T-Pain - 5 O'Clock ft. Lily Allen & Wiz Khalifa`,
      );
    });

    it('should return artists separated by a comma and ampersand', () => {
      const track = cloneDeep(tracks.items[1]) as PlaylistTrack;
      track.track.artists.push(cloneDeep(track.track.artists[0]));
      track.track.name = `Gunz N Smoke`;
      track.track.artists[0].name = 'Snoop Dogg';
      track.track.artists[1].name = 'Dr. Dre';
      track.track.artists[2].name = '50 Cent';
      track.track.artists[3].name = 'Eminem';
      expect(pipe.transform(track)).toBe(
        'Snoop Dogg - Gunz N Smoke ft. Dr. Dre, 50 Cent & Eminem',
      );
    });

    it('should return front artists separated by a comma and last by ampersand', () => {
      const track = cloneDeep(tracks.items[1]) as PlaylistTrack;
      track.track.artists.push(cloneDeep(track.track.artists[0]));
      track.track.artists.push(cloneDeep(track.track.artists[0]));
      track.track.name = `All Things Considered`;
      track.track.artists[0].name = 'Clipse';
      track.track.artists[1].name = 'The-Dream';
      track.track.artists[2].name = 'Pharrell Williams';
      track.track.artists[3].name = 'Pusha T';
      track.track.artists[4].name = 'Malice';
      expect(pipe.transform(track)).toBe(
        'Clipse - All Things Considered ft. The-Dream, Pharrell Williams, Pusha T & Malice',
      );
    });
  });
});
