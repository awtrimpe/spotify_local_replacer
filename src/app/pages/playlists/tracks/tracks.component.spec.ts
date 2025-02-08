import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { searchResp } from '../../../../test/tracks.spec';
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
      imports: [TracksComponent],
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

    it('should use the playlist ID in the URL and call setPlaylist', () => {
      const id = '123';
      const playlists = {
        items: [{ id: '123' }],
      };
      spyOn(sessionStorage, 'getItem').and.returnValue(
        JSON.stringify(playlists),
      );
      const setPlaylistSpy = spyOn(component, 'setPlaylist');
      component.ngOnInit();
      expect(setPlaylistSpy).toHaveBeenCalledWith(playlists.items[0] as any);
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

  describe('search()', () => {
    it('should clear exiting timeout if exists and call searchTracks', fakeAsync(() => {
      component.searchTimeout = setTimeout(() => {}, 100);
      let searched = '';
      let lim: unknown = undefined;
      component.spotify = {
        searchTracks: (str: string, limit: unknown) => {
          searched = str;
          lim = limit;
          return Promise.resolve(searchResp);
        },
      } as any;
      component.search('All Time Low ');
      tick(2100);
      expect(searched).toBe('All Time Low');
      expect(lim).toEqual({ limit: 5 });
      expect(component.searchMatches).toEqual(searchResp.tracks as any);
      expect(component.searchLoading).toBeFalse();
    }));

    it('should open error message on failure', fakeAsync(() => {
      const msgSpy = spyOn(component['messageService'], 'add');
      component.spotify = {
        searchTracks: (_str: string, _limit: unknown) => {
          return Promise.reject({ response: 'error' });
        },
      } as any;
      component.search('All Time Low ');
      tick(2100);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Unable to complete search tracks',
        detail: 'error',
        life: 10000,
      });
      expect(component.searchLoading).toBeFalse();
    }));
  });
});
