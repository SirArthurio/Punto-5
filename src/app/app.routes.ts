import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
          import('../app/inicio/inicio.component').then((m) => m.InicioComponent),
      },
  {
    path: 'punto3',
    loadComponent: () =>
      import('../app/punto3/punto3.component').then((m) => m.Punto3Component),
  },
  {
    path: 'punto4',
    loadComponent: () =>
      import('../app/punto4/punto4.component').then((m) => m.Punto4Component),
  },
];
