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
import { GetDepartamentoHospitalById$Params } from 'app/services/fn/departamento-hospital/get-departamento-hospital-by-id';
import { UpdateDepartamentoHospital$Params } from 'app/services/fn/departamento-hospital/update-departamento-hospital';
import { DepartamentoHospital, Provincia } from 'app/services/models';
import { DepartamentoHospitalService } from 'app/services/services';
import { Observable } from 'rxjs';

interface DepartamentoHospitalFormControls {
  name: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: 'app-edit-departamento-hopital',
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
  templateUrl: './edit-departamento-hopital.component.html',
  styleUrl: './edit-departamento-hopital.component.scss'
})
export class EditDepartamentoHopitalComponent extends CrudBaseAddEditComponent<DepartamentoHospital, any, UpdateDepartamentoHospital$Params, GetDepartamentoHospitalById$Params> implements OnInit {

  protected override form = this.fb.group<DepartamentoHospitalFormControls>({
    name: this.fb.nonNullable.control('', [Validators.required]),
    description: this.fb.nonNullable.control('')
  });

  protected override entityNameKey = 'entity.departamentoHospital';
  private departamentoHospitalService = inject(DepartamentoHospitalService);

  ngOnInit(): void {
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

  protected getSuccessRoute(): any[] {
    return ['hospital-management/departamento-hospital/departamentos-hospitalarios'];
  }

  protected saveEntity(departamentoHospitalData: DepartamentoHospital): Observable<DepartamentoHospital> {
    if (this.entityId === null) {
        // Esto no debería ocurrir si ngOnInit maneja correctamente la falta de ID, pero es una seguridad
        console.error('Cannot update without an entity ID.');
        // Usa los métodos heredados
        this.showErrorMessage('crud.save_error', { entity: this.translate.instant(this.entityNameKey) });
        return new Observable(); // Retorna un observable vacío o lanza un error
      }
    const params: UpdateDepartamentoHospital$Params = {
      id: this.entityId, // Usa el entityId heredado
      body: departamentoHospitalData
    };
    return this.departamentoHospitalService.updateDepartamentoHospital(params);
  }
  protected loadEntityData(id: any): void {
    const params: GetDepartamentoHospitalById$Params = { id: id };

    this.departamentoHospitalService.getDepartamentoHospitalById(params).subscribe({
      next: (departamentoHospital: DepartamentoHospital) => {
        this.form.patchValue({
          name: departamentoHospital.name,
          description: departamentoHospital.description || ''
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
