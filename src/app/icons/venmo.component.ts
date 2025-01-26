import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-venmo',
  template: `<svg
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Venmo"
    role="img"
    viewBox="0 0 512 512"
  >
    <rect width="512" height="512" rx="15%" fill="#3396cd" />
    <path
      d="m381.4 105.3c11 18.1 15.9 36.7 15.9 60.3 0 75.1-64.1 172.7-116.2 241.2h-118.8l-47.6-285 104.1-9.9 25.3 202.8c23.5-38.4 52.6-98.7 52.6-139.7 0-22.5-3.9-37.8-9.9-50.4z"
      fill="#ffffff"
    />
  </svg>`,
})
export class VenmoComponent {}
