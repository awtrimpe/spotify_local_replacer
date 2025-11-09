import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService],
    });

    service = TestBed.inject(StorageService);
  });

  describe('saveBrowser()', () => {
    it('should save the provided value to localStorage', () => {
      const setItemSpy = spyOn(service.localStorage, 'setItem');
      const val = 'My Value';
      const key = 'The Key';
      service.saveBrowser(key, val);
      expect(setItemSpy).toHaveBeenCalledWith(key, val);
    });
  });

  describe('getBrowser()', () => {
    it('should set token with passed value', () => {
      const setItemSpy = spyOn(service.localStorage, 'getItem');
      const val = 'My Value';
      service.getBrowser(val);
      expect(setItemSpy).toHaveBeenCalledWith(val);
    });
  });

  describe('saveSession()', () => {
    it('should save the provided value to localStorage', () => {
      const setItemSpy = spyOn(service.sessionStorage, 'setItem');
      const val = 'My Value';
      const key = 'The Key';
      service.saveSession(key, val);
      expect(setItemSpy).toHaveBeenCalledWith(key, val);
    });
  });

  describe('getSession()', () => {
    it('should set token with passed value', () => {
      const setItemSpy = spyOn(service.sessionStorage, 'getItem');
      const val = 'My Value';
      service.getSession(val);
      expect(setItemSpy).toHaveBeenCalledWith(val);
    });
  });
});
