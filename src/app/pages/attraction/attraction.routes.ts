import { Routes } from '@angular/router';

export const attractionRoutes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    loadComponent: () => import('./list/list.component')
      .then(m => m.ListComponent)
  },
  {
    path: 'favorite',
    loadComponent: () => import('./favorite/favorite.component')
      .then(m => m.FavoriteComponent)
  }
];
