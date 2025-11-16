import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { playlists } from '../../../../test/playlist.spec';
import { searchResp, tracks } from '../../../../test/tracks.spec';
import { SearchComponent } from '../../../components/search/search.component';
import { AuthService } from '../../../services/auth/auth.service';
import { TracksComponent } from './tracks.component';

class FakeAuthService {
  getToken() {
    return '';
  }
  getExpiration() {
    return new Date();
  }
}

describe('TracksComponent', () => {
  let component: TracksComponent;
  let fixture: ComponentFixture<TracksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SearchComponent, TracksComponent],
      providers: [
        { provide: AuthService, useClass: FakeAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            snapshot: {
              params: { id: '123' },
            },
          },
        },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TracksComponent);
    component = fixture.componentInstance;
    component.selectedPlaylist = playlists.items[0];
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('ngOnInit()', () => {
    it('should call setAccessToken with authService token', () => {
      let token = '';
      const value = 'myToken';
      const setTokenTimerSpy = spyOn(component, 'setTokenTimer').and.callFake(
        () => {},
      );
      spyOn(component['authService'], 'getToken').and.returnValue(value);
      spyOn(component, 'setPlaylist');
      component.spotify = {
        setAccessToken: (t: string) => (token = t),
      } as any;
      component.ngOnInit();
      expect(token).toBe(value);
      expect(setTokenTimerSpy).toHaveBeenCalled();
    });

    it('should redirect to playlists if no playlists in session', () => {
      const routerSpy = spyOn(component['router'], 'navigate');
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      component.ngOnInit();
      expect(routerSpy).toHaveBeenCalledWith(['/playlists']);
    });

    it('should set playlist from playlists retrieved from sessionStorage', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(
        JSON.stringify(playlists),
      );
      component['route'] = {
        params: of({
          id: playlists.items[0].id,
        }),
      } as any;
      component.ngOnInit();
      expect(component.selectedPlaylist).toEqual(playlists.items[0]);
    });
  });

  describe('ngAfterViewInit()', () => {
    it('should call setPlaylist with selectedPlaylist and detectChanges', () => {
      component.selectedPlaylist = playlists.items[0];
      const setPlaylistSpy = spyOn(component, 'setPlaylist');
      component.ngAfterViewInit();
      expect(setPlaylistSpy).toHaveBeenCalledWith(playlists.items[0]);
    });
  });

  describe('setTokenTimer()', () => {
    it('should set a timer to execute when user session expires', fakeAsync(() => {
      const exp_time = new Date();
      const timeout = exp_time.getTime() - new Date().getTime();
      const scrollToSpy = spyOn(window, 'scrollTo');
      component.setTokenTimer();
      expect(scrollToSpy).not.toHaveBeenCalled();
      expect(component.sessionExp).toBeFalse();
      tick(timeout);
      expect(scrollToSpy).toHaveBeenCalled();
      expect(component.sessionExp).toBeTrue();
    }));
  });

  describe('getSelectedTab()', () => {
    it('should call sessionStorage to get the last visited tab', () => {
      sessionStorage.setItem('selectedTab', '1');
      component.getSelectedTab();
      expect(component.tabSelected).toBe(1);
    });

    it('should leave tabSelected if no value set in sessionStorage', () => {
      component.tabSelected = 0;
      sessionStorage.removeItem('selectedTab');
      component.getSelectedTab();
      expect(component.tabSelected).toBe(0);
    });
  });

  describe('setTabSelected()', () => {
    it('should set tabSelected and sessionStorage value', () => {
      component.tabSelected = 0;
      component.setTabSelected(1);
      expect(component.tabSelected).toBe(1);
      expect(sessionStorage.getItem('selectedTab')).toBe('1');
    });

    it('should not set either value if number already matches', () => {
      component.tabSelected = 0;
      spyOn(sessionStorage, 'setItem');
      component.setTabSelected(0);
      expect(component.tabSelected).toBe(0);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('setPlaylist()', () => {
    it('should call getPlaylistTracks and set playlist', fakeAsync(() => {
      component.spotify = {
        getPlaylistTracks: () => Promise.resolve(tracks),
      } as any;
      component.setPlaylist(playlists.items[0]);
      tick(1000);
      expect(component.selectedPlaylist).toEqual(playlists.items[0]);
      expect(component.allTracks).toEqual(tracks.items);
      expect(component.selectedPlaylistTotal).toBe(tracks.total);
      expect(component.trackJumpOptions!.length).toBe(
        Math.floor(tracks.total / 100 + 1),
      );
    }));

    it('should use existing playlist total if returned value does not contain totol', fakeAsync(() => {
      component.selectedPlaylistTotal = 100;
      component.spotify = {
        getPlaylistTracks: () =>
          Promise.resolve({
            items: tracks.items,
          }),
      } as any;
      component.setPlaylist(playlists.items[0]);
      tick(1000);
      expect(component.selectedPlaylistTotal).toBe(100);
    }));

    it('should call setPlaylist when command triggered', fakeAsync(() => {
      component.spotify = {
        getPlaylistTracks: () => Promise.resolve(tracks),
      } as any;
      component.setPlaylist(playlists.items[0]);
      const setPlaylistSpy = spyOn(component, 'setPlaylist');
      tick(1000);
      fixture.detectChanges();
      expect(component.trackJumpOptions!.length).toBe(
        Math.floor(tracks.total / 100 + 1),
      );
      (component.trackJumpOptions![0].command as any)('' as any);
      expect(setPlaylistSpy).toHaveBeenCalledWith(component.selectedPlaylist);
      expect(component.trackOffset).toBe(0);
      expect(component.trackPos).toBe(0);
    }));

    it('should increase track offset and call setPlaylist if no tracks to show and still room to jump', fakeAsync(() => {
      component.tracks = [];
      component.selectedPlaylistTotal = 1000;
      component.trackOffset = 0;
      component.spotify = {
        getPlaylistTracks: () => Promise.resolve(tracks),
      } as any;
      component.setPlaylist(playlists.items[0]);
      const setPlaylistSpy = spyOn(component, 'setPlaylist');
      tick(1000);
      expect(component.trackOffset).toBe(100);
      expect(setPlaylistSpy).toHaveBeenCalled();
    }));

    it('should open dialog if no tracks left', fakeAsync(() => {
      component.tracks = [];
      component.selectedPlaylistTotal = 1000;
      component.trackOffset = 1000;
      component.spotify = {
        getPlaylistTracks: () => Promise.resolve(tracks),
      } as any;
      component.setPlaylist(playlists.items[0]);
      tick(1000);
      expect(component.showDialog).toBeTrue();
    }));

    it('should call findTrackMatches', fakeAsync(() => {
      component.selectedPlaylistTotal = tracks.items.length;
      component.trackOffset = 0;
      component.trackPos = 1;
      const tracksCopy = JSON.parse(JSON.stringify(tracks));
      for (const track of tracksCopy.items) {
        track.is_local = true;
      }
      component.spotify = {
        getPlaylistTracks: () => Promise.resolve(tracksCopy),
      } as any;
      const matchSpy = spyOn(component, 'findTrackMatches');
      component.setPlaylist(playlists.items[0]);
      tick(1000);
      expect(matchSpy).toHaveBeenCalledWith(tracksCopy.items[0]);
    }));

    it('should open message on error', fakeAsync(() => {
      const msgSpy = spyOn(component['messageService'], 'add');
      component.spotify = {
        getPlaylistTracks: () =>
          Promise.reject({ response: 'My Error Message' }),
      } as any;
      component.setPlaylist(playlists.items[0]);
      tick(1000);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Unable to find playlist tracks',
        detail: 'My Error Message',
        life: 10000,
      });
    }));
  });

  describe('findTrackMatches()', () => {
    beforeEach(() => {
      component['searchComp'] = {
        clear: () => {},
      } as any;
    });

    it('should set the all position to the index of the provided track', () => {
      component.tracks = component.allTracks = tracks.items;
      component.trackPos = 2;
      component.trackOffset = 0;
      const searchCompSpy = spyOn(component['searchComp'], 'clear');
      component.findTrackMatches(tracks.items[2]);
      expect(component.allPosition).toBe(2);
      expect(component.loading).toBeTrue();
      expect(searchCompSpy).toHaveBeenCalled();
    });

    it('should set track matches to the response of search', fakeAsync(() => {
      component.tracks = component.allTracks = tracks.items;
      component.trackPos = 0;
      component.trackOffset = 0;
      let searchStr = '';
      component.spotify = {
        searchTracks: (str: string) => {
          searchStr = str;
          return Promise.resolve(searchResp) as any;
        },
      } as any;
      component.findTrackMatches(tracks.items[0]);
      tick(1000);
      expect(searchStr).toBe(
        `${tracks.items[0].track.name} artist:${(tracks.items[0].track as any).artists[0].name}`,
      );
      expect(component.trackMatches).toEqual(searchResp.tracks as any);
      expect(component.loading).toBeFalse();
    }));

    it('should bump track offset and call findTrackMatches if no track provided', () => {
      const setPlaylistSpy = spyOn(component, 'setPlaylist');
      component.trackOffset = 0;
      component.findTrackMatches(undefined as any);
      expect(setPlaylistSpy).toHaveBeenCalledWith(component.selectedPlaylist);
      expect(component.trackOffset).toBe(100);
    });

    it('should open error message on failure to search for tracks', fakeAsync(() => {
      component.tracks = component.allTracks = tracks.items;
      component.trackPos = 0;
      component.trackOffset = 0;
      component.spotify = {
        searchTracks: (_str: string) =>
          Promise.reject({
            response: 'My error',
          }) as any,
      } as any;
      const msgSpy = spyOn(component['messageService'], 'add');
      component.findTrackMatches(tracks.items[0]);
      tick(1000);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Unable to find playlist tracks',
        detail: 'My error',
        life: 10000,
      });
      expect(component.loading).toBeFalse();
    }));
  });

  describe('next()', () => {
    it('should increment trackPos and call findTrackMatches', () => {
      component.tracks = [{}, {}] as any;
      const findTrackMatchesSpy = spyOn(component, 'findTrackMatches');
      component.trackPos = 0;
      component.next();
      expect(findTrackMatchesSpy).toHaveBeenCalledWith(component.tracks![1]);
      expect(component.trackPos).toBe(1);
    });
  });

  describe('back()', () => {
    it('should increment trackPos and call findTrackMatches', () => {
      const findTrackMatchesSpy = spyOn(component, 'findTrackMatches');
      component.tracks = Array.from({ length: 100 }, (_, i) => i + 1) as any;
      component.allPosition = 100;
      component.trackPos = 0;
      component.back();
      expect(findTrackMatchesSpy).toHaveBeenCalledWith(component.tracks![99]);
      expect(component.trackPos).toBe(99);
    });

    it('should decrement trackPos and call findTrackMatches', () => {
      component.tracks = [{}, {}] as any;
      const findTrackMatchesSpy = spyOn(component, 'findTrackMatches');
      component.trackPos = 1;
      component.back();
      expect(findTrackMatchesSpy).toHaveBeenCalledWith(component.tracks![0]);
      expect(component.trackPos).toBe(0);
    });
  });

  describe('replaceTrack()', () => {
    beforeEach(() => {
      component['searchComp'] = {
        clear: () => {},
      } as any;
    });

    it('should call to clear search box', () => {
      component.tabSelected = 0;
      component.trackMatches = searchResp.tracks.items[0] as any;
      component.selectedPlaylist = playlists.items[0];
      spyOn(component, 'findTrackMatches');
      const searchCompSpy = spyOn(component['searchComp'], 'clear');
      component.spotify = {
        removeTracksFromPlaylistInPositions: () => Promise.resolve(),
      } as any;
      component.replaceTrack(
        searchResp.tracks.items[0] as any,
        component.allPosition,
      );
      expect(component.trackMatches).toBeUndefined();
      expect(component.loading).toBeTrue();
      expect(searchCompSpy).toHaveBeenCalled();
    });

    it('should call to remove and add track', fakeAsync(() => {
      component.tabSelected = 0;
      component.trackMatches = searchResp.tracks.items[0] as any;
      component.selectedPlaylist = playlists.items[0];
      component.allPosition = 0;
      component.tracks = tracks.items;
      component.trackPos = 0;
      const tracksInput = {
        id: '',
        pos: [1],
        trackssnap_id: '',
      };
      const addTracksInput = {
        id: '',
        uri: [''],
        pos: {},
      };
      component.spotify = {
        removeTracksFromPlaylistInPositions: (
          id: string,
          pos: number[],
          trackssnap_id: string,
        ) => {
          tracksInput.id = id;
          tracksInput.pos = pos;
          tracksInput.trackssnap_id = trackssnap_id;
          return Promise.resolve();
        },
        addTracksToPlaylist: (id: string, uri: string[], pos: {}) => {
          addTracksInput.id = id;
          addTracksInput.uri = uri;
          addTracksInput.pos = pos;
          return Promise.resolve();
        },
      } as any;
      spyOn(component, 'findTrackMatches');
      component.replaceTrack(
        searchResp.tracks.items[0] as any,
        component.allPosition,
      );
      tick(1000);
      expect(tracksInput).toEqual({
        id: '4bHJJit8d13R4tefdfjUfE',
        pos: [0],
        trackssnap_id: 'AAAACiB/oPRwTm8sgeLS6DHBpwMuGuj8',
      });
      expect(addTracksInput).toEqual({
        id: '4bHJJit8d13R4tefdfjUfE',
        uri: ['spotify:track:0SuLAslEMFZAXf0SwY7syi'],
        pos: { position: 0 },
      });
      expect(component.findTrackMatches).toHaveBeenCalledWith(
        component.tracks![component.trackPos],
      );
      expect(component.loading).toBeFalse();
    }));

    it('should not change trackPos and call setPlaylist for all replacement', fakeAsync(() => {
      component.tabSelected = 1;
      component.trackPos = 0;
      component.spotify = {
        removeTracksFromPlaylistInPositions: (
          _id: string,
          _pos: number[],
          _trackssnap_id: string,
        ) => {
          return Promise.resolve();
        },
        addTracksToPlaylist: (_id: string, _uri: string[], _pos: {}) => {
          return Promise.resolve();
        },
      } as any;
      const msgSpy = spyOn(component['messageService'], 'add');
      const setPlaylistSpy = spyOn(component, 'setPlaylist');
      component.replaceTrack(searchResp.tracks.items[0] as any, 400);
      tick(1000);
      expect(component.trackPos).toBe(0);
      expect(setPlaylistSpy).toHaveBeenCalledWith(component.selectedPlaylist);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'info',
        summary: 'Track successfully replaced.',
        detail: `${searchResp.tracks.items[0].name} has replaced the previous track at position 400 in the playlist`,
        life: 5000,
      });
    }));

    it('should open error message if add tracks fails', fakeAsync(() => {
      component.trackMatches = searchResp.tracks.items[0] as any;
      component.selectedPlaylist = playlists.items[0];
      component.allPosition = 0;
      component.tracks = tracks.items;
      component.trackPos = 0;
      component.spotify = {
        removeTracksFromPlaylistInPositions: () => Promise.resolve(),
        addTracksToPlaylist: () =>
          Promise.reject({
            response: 'My Error',
          }),
      } as any;
      const msgSpy = spyOn(component['messageService'], 'add');
      component.replaceTrack(
        searchResp.tracks.items[0] as any,
        component.allPosition,
      );
      tick(1000);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Unable to add track to playlist',
        detail: 'My Error',
        life: 10000,
      });
    }));

    it('should open message on removal error', fakeAsync(() => {
      component.spotify = {
        removeTracksFromPlaylistInPositions: () =>
          Promise.reject({
            response: 'My Error',
          }),
      } as any;
      component.selectedPlaylist = playlists.items[0];
      const msgSpy = spyOn(component['messageService'], 'add');
      component.replaceTrack(
        searchResp.tracks.items[0] as any,
        component.allPosition,
      );
      tick(1000);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Unable to remove track from playlist',
        detail: 'My Error',
        life: 10000,
      });
    }));
  });
});
