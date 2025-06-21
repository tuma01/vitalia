import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { GetDoctorProfessionSpecialityById$Params } from 'app/services/fn/doctor-profession-speciality/get-doctor-profession-speciality-by-id';
import { UpdateDoctorProfessionSpeciality$Params } from 'app/services/fn/doctor-profession-speciality/update-doctor-profession-speciality';
import { DoctorProfessionSpeciality, Provincia } from 'app/services/models';
import { DoctorProfessionSpecialityService } from 'app/services/services';
import { Observable } from 'rxjs';

interface DoctorProfessionSpecialityFormControls {
  name: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-edit-especialidad',
  imports: [
    PageHeaderComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './edit-especialidad.component.html',
  styleUrl: './edit-especialidad.component.scss'
})
export class EditEspecialidadComponent extends CrudBaseAddEditComponent<DoctorProfessionSpeciality, any, UpdateDoctorProfessionSpeciality$Params, GetDoctorProfessionSpecialityById$Params> implements OnInit {

  protected override form = this.fb.group<DoctorProfessionSpecialityFormControls>({
    name: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control('')
  });

  protected override entityNameKey = 'entity.doctorProfessionSpeciality';
  private doctorProfessionSpecialityService = inject(DoctorProfessionSpecialityService);

  ngOnInit(): void {
    // this.loadData();
    this.activatedRoute.queryParams.subscribe(params => {
      const id = params['id'] ? +params['id'] : null;
      if (id) {
        // Asigna al entityId heredado de la clase base
        this.entityId = id;
        this.loadEntityData(this.entityId); // Llama al método de carga
      } else {
        // Manejar el caso si no hay ID en los parámetros (ej. redirigir a lista o error)
        console.error('No entity ID provided for editing.');
        // Usa el entityNameKey heredado y el método showErrorMessage heredado
        this.showErrorMessage('crud.load_error', { entity: this.translate.instant(this.entityNameKey) });
        // Usa el router heredado y el método getSuccessRoute heredado
        this.router.navigate(this.getSuccessRoute());
      }
    });
  }

  // doctorProfessionSpecialityList: Provincia[] = [];
  // loadData(): void {
  //   this.doctorProfessionSpecialityService.getAllDoctorProfessionSpecialities().subscribe({
  //     next: (response: DoctorProfessionSpeciality[]) => {
  //       this.doctorProfessionSpecialityList = response;
  //     },
  //     error: (error: any) => {
  //       console.error('Error al cargar Provincias:', error);
  //     }
  //   });
  // }

  protected getSuccessRoute(): any[] {
      return ['medico/especialidad/especialidades'];
    }
    protected saveEntity(doctorProfessionSpecialityData: DoctorProfessionSpeciality): Observable<DoctorProfessionSpeciality> {
      if (this.entityId === null) {
          // Esto no debería ocurrir si ngOnInit maneja correctamente la falta de ID, pero es una seguridad
          console.error('Cannot update without an entity ID.');
          // Usa los métodos heredados
          this.showErrorMessage('crud.save_error', { entity: this.translate.instant(this.entityNameKey) });
          return new Observable(); // Retorna un observable vacío o lanza un error
        }
      const params: UpdateDoctorProfessionSpeciality$Params = {
        id: this.entityId, // Usa el entityId heredado
        body: doctorProfessionSpecialityData
      };
      return this.doctorProfessionSpecialityService.updateDoctorProfessionSpeciality(params);
    }
    protected loadEntityData(id: any): void {
      const params: GetDoctorProfessionSpecialityById$Params = { id: id };

      this.doctorProfessionSpecialityService.getDoctorProfessionSpecialityById(params).subscribe({
        next: (doctorProfessionSpeciality: DoctorProfessionSpeciality) => {
          this.form.patchValue({
            name: doctorProfessionSpeciality.name,
            description: doctorProfessionSpeciality.description || ''
          });
        },
        error: (error) => {
          console.error('Error loading entity:', error);
          // Usa el método handleError heredado
          this.handleError(error, 'crud.load_error');
          // Usa el router heredado y el método getSuccessRoute heredado
          this.router.navigate(this.getSuccessRoute());
        }
      });
    }

}
