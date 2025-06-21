import { Routes } from '@angular/router';
import { ProvinciasComponent } from './provincias/provincias.component';
import { AddProvinciaComponent } from './add-provincia/add-provincia.component';
import { EditProvinciaComponent } from './edit-provincia/edit-provincia.component';

export const routes: Routes = [
  { path: 'provincias', component: ProvinciasComponent },
  { path: 'addProvincia', component: AddProvinciaComponent },
  { path: 'editProvincia', component: EditProvinciaComponent },
];
