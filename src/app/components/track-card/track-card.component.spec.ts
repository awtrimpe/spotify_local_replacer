import { ComponentFixture, TestBed } from '@angular/core/testing';
import SpotifyWebApi from 'spotify-web-api-js';
import { TrackCardComponent } from './track-card.component';

const track = {
  album: {
    album_type: 'single',
    artists: [
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/5lFGY6pShtYlKNIggeRkT7',
        },
        href: 'https://api.spotify.com/v1/artists/5lFGY6pShtYlKNIggeRkT7',
        id: '5lFGY6pShtYlKNIggeRkT7',
        name: 'Kino Isaac',
        type: 'artist',
        uri: 'spotify:artist:5lFGY6pShtYlKNIggeRkT7',
      },
      {
        external_urls: {
          spotify: 'https://open.spotify.com/artist/1sBkRIssrMs1AbVkOJbc7a',
        },
        href: 'https://api.spotify.com/v1/artists/1sBkRIssrMs1AbVkOJbc7a',
        id: '1sBkRIssrMs1AbVkOJbc7a',
        name: 'Rick Ross',
        type: 'artist',
        uri: 'spotify:artist:1sBkRIssrMs1AbVkOJbc7a',
      },
    ],
    available_markets: ['AR', 'AU', 'AT', 'BE'],
    external_urls: {
      spotify: 'https://open.spotify.com/album/2cKXVoi5jDSt56cC35fGyt',
    },
    href: 'https://api.spotify.com/v1/albums/2cKXVoi5jDSt56cC35fGyt',
    id: '2cKXVoi5jDSt56cC35fGyt',
    images: [
      {
        height: 640,
        width: 640,
        url: 'https://i.scdn.co/image/ab67616d0000b273387ebd8964417e6f494e0e9e',
      },
      {
        height: 300,
        width: 300,
        url: 'https://i.scdn.co/image/ab67616d00001e02387ebd8964417e6f494e0e9e',
      },
    ],
    is_playable: true,
    name: 'Rise Up',
    release_date: '2023-09-30',
    release_date_precision: 'day',
    total_tracks: 1,
    type: 'album',
    uri: 'spotify:album:2cKXVoi5jDSt56cC35fGyt',
  },
  artists: [
    {
      external_urls: {
        spotify: 'https://open.spotify.com/artist/5lFGY6pShtYlKNIggeRkT7',
      },
      href: 'https://api.spotify.com/v1/artists/5lFGY6pShtYlKNIggeRkT7',
      id: '5lFGY6pShtYlKNIggeRkT7',
      name: 'Kino Isaac',
      type: 'artist',
      uri: 'spotify:artist:5lFGY6pShtYlKNIggeRkT7',
    },
    {
      external_urls: {
        spotify: 'https://open.spotify.com/artist/1sBkRIssrMs1AbVkOJbc7a',
      },
      href: 'https://api.spotify.com/v1/artists/1sBkRIssrMs1AbVkOJbc7a',
      id: '1sBkRIssrMs1AbVkOJbc7a',
      name: 'Rick Ross',
      type: 'artist',
      uri: 'spotify:artist:1sBkRIssrMs1AbVkOJbc7a',
    },
  ],
  available_markets: ['AR', 'AU'],
  disc_number: 1,
  duration_ms: 274961,
  explicit: true,
  external_ids: {
    isrc: 'IEWNY2309519',
  },
  external_urls: {
    spotify: 'https://open.spotify.com/track/3juq2HxiA2RmBqgwx4ZB1p',
  },
  href: 'https://api.spotify.com/v1/tracks/3juq2HxiA2RmBqgwx4ZB1p',
  id: '3juq2HxiA2RmBqgwx4ZB1p',
  is_local: false,
  is_playable: true,
  name: 'Rise Up',
  popularity: 0,
  preview_url: null,
  track_number: 1,
  type: 'track',
  uri: 'spotify:track:3juq2HxiA2RmBqgwx4ZB1p',
};

describe('TrackCardComponent', () => {
  let component: TrackCardComponent;
  let fixture: ComponentFixture<TrackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackCardComponent],
      providers: [SpotifyWebApi],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('template tests', () => {
    it('should emit selected track when clicked', () => {
      component.track = track as any;
      component.replaceable = true;
      fixture.detectChanges();
      const nextSpy = spyOn(component.selectedTrack, 'next');
      const element = fixture.debugElement.nativeElement;
      element.querySelector('p-button').click();
      expect(nextSpy).toHaveBeenCalledWith(component.track);
    });

    it('should not display button if not replaceable', () => {
      component.track = track as any;
      component.replaceable = false;
      fixture.detectChanges();
      const element = fixture.debugElement.nativeElement;
      expect(element.querySelector('p-button')).toBeNull();
    });
  });
});
