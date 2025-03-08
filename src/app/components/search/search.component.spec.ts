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
import { searchResp } from '../../../test/tracks.spec';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SearchComponent],
      providers: [
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

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  describe('clear()', () => {
    it('should set searchMatches to undefined and reset value of box if exists', () => {
      component.searchMatches = {} as any;
      component.searchBox = {
        nativeElement: {
          value: 'Hello World!',
        },
      } as any;
      expect(component.searchMatches).toBeDefined();
      component.clear();
      expect(component.searchMatches).toBeUndefined();
      expect(component.searchBox.nativeElement.value).toBe('');
    });
  });
});
