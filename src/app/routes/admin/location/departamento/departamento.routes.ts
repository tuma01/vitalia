import { Routes } from '@angular/router';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { AddDepartamentoComponent } from './add-departamento/add-departamento.component';
import { EditDepartamentoComponent } from './edit-departamento/edit-departamento.component';

export const routes: Routes = [
  { path: 'departamentos', component: DepartamentosComponent },
  { path: 'editDepartamento', component: EditDepartamentoComponent },
  { path: 'addDepartamento', component: AddDepartamentoComponent },
];
