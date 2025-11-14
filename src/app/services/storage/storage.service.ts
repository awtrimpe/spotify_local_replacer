import { Injectable } from '@angular/core';
import { anyToString } from '../../core/utils';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  localStorage = window.localStorage;
  sessionStorage = window.sessionStorage;

  /** Saves the provided value to the provided key in localStorage */
  saveBrowser(key: string, val: unknown) {
    try {
      this.localStorage.setItem(key, anyToString(val));
    } catch {
      console.error('Failed to save to local storage');
    }
  }

  /** Retrieves the provided key's value from localStorage if it exists */
  getBrowser(key: string): string | null {
    return this.localStorage.getItem(key);
  }

  /** Saves the provided value to the provided key in sessionStorage */
  saveSession(key: string, val: unknown) {
    try {
      this.sessionStorage.setItem(key, anyToString(val));
    } catch {
      console.error('Failed to save to session storage');
    }
  }

  /** Retrieves the provided key's value from sessionStorage if it exists */
  getSession(key: string): string | null {
    return this.sessionStorage.getItem(key);
  }
}
