import { Routes } from '@angular/router';
// import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
// import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component'; // Update the path as necessary

import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { Error403Component } from './routes/sessions/403.component';
import { Error404Component } from './routes/sessions/404.component';
import { Error500Component } from './routes/sessions/500.component';
import { LoginComponent } from './routes/sessions/login/login.component';
// import { RegisterComponent } from './routes/sessions/register/register.component';
import { AuthGuard } from '@core/authentication/guard/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },  //, canActivate: [AuthGuard]
      { path: '403', component: Error403Component },
      { path: '404', component: Error404Component },
      { path: '500', component: Error500Component },
      {
        path: 'location',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./routes/admin/location/location.routes').then(m => m.routes),
          },
        ]
      },
      {
        path: 'nurse',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./routes/nurse/nurse.routes').then(m => m.routes),
          },
        ]
      },
      {
        path: 'hospital-management',
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            loadChildren: () => import('./routes/admin/hospital-management/hospital-management.routes').then(m => m.routes),
          },
        ]
      },
      {
        path: 'medico',
        canActivate: [AuthGuard],
        children: [
           {
            path: '',
            loadChildren: () => import('./routes/admin/medico/medico.routes').then(m => m.routes),
          },
        ]
        //loadChildren: () => import('./routes/admin/medico.routes').then(m => m.routes),
      },
      {
        path: 'profile',
        loadChildren: () => import('./routes/profile/profile.routes').then(m => m.routes),
      },
    ],
  },
  { path: 'login', component: LoginComponent, data: { title: 'Login Page' } },

  {
    path: 'register',
    loadComponent: () => import('./routes/sessions/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'activate-account',
    loadComponent: () => import('./routes/sessions/activate-account/activate-account.component').then(m => m.ActivateAccountComponent),
    data: {
      title: 'Activate Account Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' },
];

