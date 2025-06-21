import { Routes } from '@angular/router';
import { DepartamentosHospitalariosComponent } from './departamentos-hospitalarios/departamentos-hospitalarios.component';
import { AddDepartamentoHopitalComponent } from './add-departamento-hopital/add-departamento-hopital.component';
import { EditDepartamentoHopitalComponent } from './edit-departamento-hopital/edit-departamento-hopital.component';

export const routes: Routes = [
  { path: 'departamentos-hospitalarios', component: DepartamentosHospitalariosComponent },
  { path: 'add-departamento-hospital', component: AddDepartamentoHopitalComponent },
  { path: 'edit-departamento-hospital', component: EditDepartamentoHopitalComponent}
];
