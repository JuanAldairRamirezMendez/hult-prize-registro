import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'success',
        loadComponent: () => import('./pages/success/success').then(m => m.SuccessComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
