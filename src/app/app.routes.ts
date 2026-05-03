import { Routes } from '@angular/router';
import GifsSideMenuHeaderComponent from './gifs/components/side-menu/side-menu-header/side-menu-header.component';
import GifsSideMenuOptionsComponent from './gifs/components/side-menu/side-menu-options/side-menu-options.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page.component'),
    children: [
      //Definicion de rutas hijas
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page.component'),
      },
      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page.component'),
      },
      {
        path: 'history/:query',
        loadComponent: () => import('./gifs/pages/gif-history/gif-history.component'),
      },
      {
        path: '**',
        redirectTo: 'trending',
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
