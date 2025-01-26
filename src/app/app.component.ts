import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ToastModule } from 'primeng/toast';
import { PolishedPineComponent } from './icons/polished-pine.component';

@Component({
  selector: 'app-root',
  imports: [
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
export class AppComponent {
  title = 'Local File Replacer';
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
}
