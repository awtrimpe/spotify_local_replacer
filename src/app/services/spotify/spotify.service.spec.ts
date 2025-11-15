import { TestBed } from '@angular/core/testing';
import { tracks } from '../../../test/tracks.spec';
import { SpotifyService } from './spotify.service';

describe('SpotifyService', () => {
  let service: SpotifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpotifyService],
    });

    service = TestBed.inject(SpotifyService);
  });

  describe('playlistTracksInMemory()', () => {
    it('should return false if not in memory', () => {
      service.playlistTracks = {};
      expect(service.playlistTracksInMemory('aSpecialKey')).toBeFalse();
    });

    it('should return true if in memory', () => {
      const key = 'aSpecialKey';
      service.playlistTracks[key] = tracks.items;
      expect(service.playlistTracksInMemory(key)).toBeTrue();
    });
  });
});
