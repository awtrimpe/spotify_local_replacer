import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { PolishedPineComponent } from './icons/polished-pine.component';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    MenubarModule,
    PolishedPineComponent,
    RouterModule,
    RouterOutlet,
    ScrollTopModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: '/',
    },
    {
      label: 'Playlists',
      icon: 'pi pi-headphones',
      routerLink: '/playlists',
    },
    {
      label: 'Guide',
      icon: 'pi pi-book',
      routerLink: '/guide',
    },
  ];
  year = new Date().getFullYear();
  @ViewChild('menuBar', { read: ElementRef }) menuBarRef!: ElementRef;
  userDisplay: SpotifyApi.CurrentUsersProfileResponse | undefined = undefined;

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement: HTMLElement) {
    if (
      !this.menuBarRef.nativeElement.contains(targetElement) &&
      this.menuBarRef.nativeElement.children[0] &&
      this.menuBarRef.nativeElement.children[0].classList &&
      Array.from(this.menuBarRef.nativeElement.children[0].classList).includes(
        'p-menubar-mobile-active',
      ) &&
      this.menuBarRef.nativeElement.children[0].children[0]
    ) {
      this.menuBarRef.nativeElement.children[0].children[0].click();
    }
  }

  ngOnInit() {
    this.authService.userDisplay.subscribe((val) => {
      this.userDisplay = val;
    });
  }
}
