import { Routes } from '@angular/router';
import { AddNurseComponent } from './add-nurse/add-nurse.component';
import { EditNurseComponent } from './edit-nurse/edit-nurse.component';
import { NursesComponent } from './nurses/nurses.component';

export const routes: Routes = [
  { path: 'nurses', component: NursesComponent },
  { path: 'editNurse', component: EditNurseComponent },
  { path: 'addNurse', component: AddNurseComponent },
];
