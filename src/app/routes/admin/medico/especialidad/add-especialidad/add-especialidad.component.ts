import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CreateDoctorProfessionSpeciality$Params } from 'app/services/fn/doctor-profession-speciality/create-doctor-profession-speciality';
import { CreateMunicipio$Params } from 'app/services/fn/municipio/create-municipio';
import { DoctorProfessionSpeciality, Municipio } from 'app/services/models';
import { DoctorProfessionSpecialityService } from 'app/services/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-especialidad',
  imports: [
    CommonModule,
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
  templateUrl: './add-especialidad.component.html',
  styleUrl: './add-especialidad.component.scss'
})
export class AddEspecialidadComponent extends CrudBaseAddEditComponent<DoctorProfessionSpeciality, CreateDoctorProfessionSpeciality$Params, any, any> implements OnInit {

  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.doctorProfessionSpeciality';

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private doctorProfessionSpecialityService = inject(DoctorProfessionSpecialityService);

  ngOnInit(): void {
    this.loadData();
  }

  doctorProfessionSpecialityList: DoctorProfessionSpeciality[] = [];
  loadData(): void {
    this.doctorProfessionSpecialityService.getAllDoctorProfessionSpecialities().subscribe({
      next: (response: DoctorProfessionSpeciality[]) => {
        this.doctorProfessionSpecialityList = response;
      },
      error: (error: any) => {
        console.error('Error al cargar Especialidades del doctor:', error);
      }
    });
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(doctorProfessionSpeciality: DoctorProfessionSpeciality): Observable<DoctorProfessionSpeciality> {
    const params: CreateDoctorProfessionSpeciality$Params = { body: doctorProfessionSpeciality };
    return this.doctorProfessionSpecialityService.createDoctorProfessionSpeciality(params);
  }

    // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
  }

  protected getSuccessRoute(): any[] {
    return ['medico/especialidad/especialidades'];
  }

}
