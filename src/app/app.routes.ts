import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/attraction',
    pathMatch: 'full'
  },
  {
    path: 'attraction',
    loadChildren: () => import('./pages/attraction/attraction.routes').then(m => m.attractionRoutes)
  },
  {
    path: '**',
    redirectTo: '/attraction'
  }
];

// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: '/attraction',
//     pathMatch: 'full'
//   },
//   {
//     path: 'attraction',
//     children: [
//       {
//         path: '',
//         redirectTo: 'list',
//         pathMatch: 'full'
//       },
//       {
//         path: 'list',
//         loadComponent: () => import('./pages/attraction/list/list.component')
//           .then(m => m.ListComponent)
//       },
//       {
//         path: 'favorite',
//         loadComponent: () => import('./pages/attraction/favorite/favorite.component')
//           .then(m => m.FavoriteComponent)
//       }
//     ]
//   },
//   {
//     path: '**',
//     redirectTo: '/attraction'
//   }
// ];
