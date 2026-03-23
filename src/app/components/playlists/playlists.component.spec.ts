import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { playlists } from '../../../test/playlist.spec';
import { userInfo } from '../../../test/user.spec';
import { AuthService } from '../../services/auth/auth.service';
import { PlaylistComponent } from './playlists.component';

class FakeAuthService {
  userDisplay = new BehaviorSubject('');
  getToken() {
    return '';
  }
  getExpiration() {
    return new Date();
  }
  setUserDisplay() {
    return Promise.resolve({ id: 'ABC' });
  }
}

describe('PlaylistComponent', () => {
  let component: PlaylistComponent;
  let fixture: ComponentFixture<PlaylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, PlaylistComponent],
      providers: [
        { provide: AuthService, useClass: FakeAuthService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '123' },
            },
          },
        },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlaylistComponent);
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
      spyOn(component['authService'], 'getToken').and.returnValue(value);
      spyOn(component, 'getUsersPlaylists');
      const getUserInfoSpy = spyOn(component, 'getUserInfo');
      component.spotify = {
        setAccessToken: (t: string) => (token = t),
      } as any;
      component.ngOnInit();
      expect(token).toBe(value);
      expect(getUserInfoSpy).toHaveBeenCalled();
    });

    it('should call getUsersPlaylists if no playlists in session memory', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      const playlistSpy = spyOn(component, 'getUsersPlaylists');
      component.ngOnInit();
      expect(playlistSpy).toHaveBeenCalled();
      expect(component.loading).toBeTrue();
    });

    it('should set playlists from session memory if available', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(
        JSON.stringify(playlists),
      );
      component.ngOnInit();
      expect(component.playlists).toEqual(
        JSON.parse(JSON.stringify(playlists)),
      );
    });
  });

  describe('getUsersPlaylists()', () => {
    it('should set playlists from response in session storage', fakeAsync(() => {
      component.spotify = {
        getUserPlaylists: () => Promise.resolve(playlists),
      } as any;
      spyOn(sessionStorage, 'setItem').and.callFake(() => {});
      component.getUsersPlaylists();
      tick(1000);
      expect(component.playlists).toEqual(playlists);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'playlists',
        JSON.stringify(playlists),
      );
    }));

    it('should open message on failure to retrieve playlists', fakeAsync(() => {
      const msgSpy = spyOn(component['messageService'], 'add');
      component.spotify = {
        getUserPlaylists: () => Promise.reject('error'),
      } as any;
      component.getUsersPlaylists();
      tick(1000);
      expect(msgSpy).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Unable to find any playlists',
        detail: 'error',
        life: 10000,
      });
    }));
  });

  describe('getUserInfo()', () => {
    it('should call setUserDisplay with new value', fakeAsync(() => {
      component['authService'].userDisplay = new BehaviorSubject<
        SpotifyApi.CurrentUsersProfileResponse | undefined
      >(undefined);
      const setUserDisplaySpy = spyOn(
        component['authService'],
        'setUserDisplay',
      );
      component.spotify = {
        getMe: () => Promise.resolve(userInfo),
      } as any;
      component.getUserInfo();
      tick(1000);
      expect(setUserDisplaySpy).toHaveBeenCalledWith(userInfo);
    }));

    it('should not call to get user info is display value already present', fakeAsync(() => {
      component['authService'].userDisplay = new BehaviorSubject<
        SpotifyApi.CurrentUsersProfileResponse | undefined
      >(userInfo);
      const getMeSpy = spyOn(component['spotify'], 'getMe');
      component.getUserInfo();
      tick(1000);
      expect(getMeSpy).not.toHaveBeenCalled();
    }));
  });
});
