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
import { CreateDepartamentoHospital$Params } from 'app/services/fn/departamento-hospital/create-departamento-hospital';
import { DepartamentoHospital } from 'app/services/models';
import { DepartamentoHospitalService, DoctorProfessionSpecialityService } from 'app/services/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-departamento-hopital',
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
  templateUrl: './add-departamento-hopital.component.html',
  styleUrl: './add-departamento-hopital.component.scss'
})
export class AddDepartamentoHopitalComponent extends CrudBaseAddEditComponent<DepartamentoHospital, CreateDepartamentoHospital$Params, any, any> implements OnInit {

  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.departamentoHospital';

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private departamentoHospitalService = inject(DepartamentoHospitalService);

  ngOnInit(): void {
    this.loadData();
  }

  departamentoHospitalList: DepartamentoHospital[] = [];
  loadData(): void {
    this.departamentoHospitalService.getAllDepartamentoHospital().subscribe({
      next: (response: DepartamentoHospital[]) => {
        this.departamentoHospitalList = response;
      },
      error: (error: any) => {
        console.error('Error al cargar los departementos hospitalarios:', error);
      }
    });
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(departamentoHospital: DepartamentoHospital): Observable<DepartamentoHospital> {
    const params: CreateDepartamentoHospital$Params = { body: departamentoHospital };
    return this.departamentoHospitalService.createDepartamentoHospital(params);
  }

    // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
  }

  protected getSuccessRoute(): any[] {
    return ['hospital-management/departamento-hospital/departamentos-hospitalarios'];
  }

}
