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

  describe('getAllPlaylistTracks()', () => {
    it('should not call API if tracks already in memory', (done) => {
      const playlistID = '5lw8TFcYPg1X7ebaWWWOc9';
      service.playlistTracks[playlistID] = tracks.items;
      const getPlaylistTracksSpy = spyOn(
        service['spotify'],
        'getPlaylistTracks',
      );
      service.getAllPlaylistTracks(playlistID).then((resp) => {
        expect(resp).toEqual(tracks.items);
        expect(getPlaylistTracksSpy).not.toHaveBeenCalled();
        done();
      });
    });

    it('should call until the offset is greater than the total', (done) => {
      const getPlaylistTracksSpy = spyOn(
        service['spotify'],
        'getPlaylistTracks',
      ).and.resolveTo(tracks);
      const playlistID = 'abc123';
      service.getAllPlaylistTracks(playlistID).then((resp) => {
        expect(resp.length).toBeGreaterThan(1);
        expect(getPlaylistTracksSpy).toHaveBeenCalledTimes(36);
        expect(service.playlistTracks[playlistID]).toBeDefined();
        done();
      });
    });

    it('should remove tracks from memory if failure encountered', (done) => {
      const err = 'Bad error!';
      const getPlaylistTracksSpy = spyOn(
        service['spotify'],
        'getPlaylistTracks',
      ).and.returnValues(Promise.resolve(tracks), Promise.reject(err));
      const playlistID = 'abc123';
      service.getAllPlaylistTracks(playlistID).catch((resp: Error) => {
        expect(resp.message).toContain(
          `Failed to load tracks for ${playlistID} (offset 100): ${err}`,
        );
        expect(getPlaylistTracksSpy).toHaveBeenCalledTimes(2);
        expect(service.playlistTracks).toEqual({});
        done();
      });
    });
  });
});
