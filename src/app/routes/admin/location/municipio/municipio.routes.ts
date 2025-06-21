import { Routes } from '@angular/router';
import { MunicipiosComponent } from './municipios/municipios.component';
import { EditMunicipioComponent } from './edit-municipio/edit-municipio.component';
import { AddMunicipioComponent } from './add-municipio/add-municipio.component';

export const routes: Routes = [
  { path: 'municipios', component: MunicipiosComponent },
  { path: 'editMunicipio', component: EditMunicipioComponent },
  { path: 'addMunicipio', component: AddMunicipioComponent },
];
