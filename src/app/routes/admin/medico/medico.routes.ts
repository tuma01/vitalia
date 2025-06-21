import { Routes } from '@angular/router';
import { AuthGuard } from '@core/authentication/guard/auth-guard';


export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'especialidad',
        loadChildren: () => import('./especialidad/especialidad.routes').then(m => m.routes),
      }
    ]
  }
  // { path: 'editarMedico', component: EditarMedicoComponent },
  // { path: 'listaMedicos', component: ListaMedicosComponent },
  // { path: 'registrarMedico', component: RegistrarMedicoComponent }
];
