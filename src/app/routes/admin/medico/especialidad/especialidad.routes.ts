import { Routes } from '@angular/router';
import { EspecialidadesComponent } from './especialidades/especialidades.component';
import { EditEspecialidadComponent } from './edit-especialidad/edit-especialidad.component';
import { AddEspecialidadComponent } from './add-especialidad/add-especialidad.component';

export const routes: Routes = [
  { path: 'especialidades', component: EspecialidadesComponent },
  { path: 'editEspecialidad', component: EditEspecialidadComponent },
  { path: 'addEspecialidad', component: AddEspecialidadComponent },
];
