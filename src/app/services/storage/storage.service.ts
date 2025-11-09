import { Injectable } from '@angular/core';
import { anyToString } from '../../core/utils';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  localStorage = localStorage;
  sessionStorage = sessionStorage;

  /** Saves the provided value to the provided key in localStorage */
  saveBrowser(key: string, val: unknown) {
    localStorage.setItem(key, anyToString(val));
  }

  /** Retrieves the provided key's value from localStorage if it exists */
  getBrowser(key: string): string | null {
    return localStorage.getItem(key);
  }

  /** Saves the provided value to the provided key in sessionStorage */
  saveSession(key: string, val: unknown) {
    sessionStorage.setItem(key, anyToString(val));
  }

  /** Retrieves the provided key's value from sessionStorage if it exists */
  getSession(key: string): string | null {
    return sessionStorage.getItem(key);
  }
}
