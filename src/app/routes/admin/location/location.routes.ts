import { Routes } from '@angular/router';
import { AuthGuard } from '@core/authentication/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],  // <- Doble protección (opcional)
    // data: {roles: ['ROLE_ADMIN', 'SUPER_ADMIN']},
    children: [
      {
        path: 'pais',
        loadChildren: () => import('./pais/pais.routes').then(m => m.routes),
      },
      {
        path: 'departamento',
        loadChildren: () => import('./departamento/departamento.routes').then(m => m.routes),
      },
      {
        path: 'provincia',
        loadChildren: () => import('./provincia/provincia.routes').then(m => m.routes),
      },
      {
        path: 'municipio',
        loadChildren: () => import('./municipio/municipio.routes').then(m => m.routes),
      }
    ]
  }
];
