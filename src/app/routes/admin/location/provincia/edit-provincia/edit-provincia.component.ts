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
import { GetProvinciaById$Params } from 'app/services/fn/provincia/get-provincia-by-id';
import { UpdateProvincia$Params } from 'app/services/fn/provincia/update-provincia';
import { Departamento, Provincia } from 'app/services/models';
import { DepartamentoService, CountryService, ProvinciaService } from 'app/services/services';
import { Observable } from 'rxjs';

interface ProvinciaFormControls {
  nombre: FormControl<string>;
  departamento: FormControl<Departamento | null>; // Explicitly define that country can be Country or null
  poblacion: FormControl<number>;
  superficie: FormControl<number>;
}

@Component({
  selector: 'app-edit-provincia',
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
  templateUrl: './edit-provincia.component.html',
  styleUrl: './edit-provincia.component.scss'
})
export class EditProvinciaComponent  extends CrudBaseAddEditComponent<Provincia, any, UpdateProvincia$Params, GetProvinciaById$Params> implements OnInit {

  protected override form = this.fb.group<ProvinciaFormControls>({
    nombre: this.fb.nonNullable.control('', [Validators.required]),
    departamento: this.fb.control<Departamento | null>(null, [Validators.required]), // Allow null initially, but expect Country
    poblacion: this.fb.nonNullable.control(0 , [Validators.pattern(/^[0-9]*$/)]),
    superficie: this.fb.nonNullable.control(0, [Validators.pattern(/^[0-9]*$/)]),
  });

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.provincia';
  private departamentoService = inject(DepartamentoService);
  private provinciaService = inject(ProvinciaService);

  ngOnInit(): void {
    this.loadData();
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

  departamentoList: Departamento[] = [];
  loadData(): void {
    this.departamentoService.getAllDepartamentos().subscribe({
      next: (response: Departamento[]) => {
        this.departamentoList = response;
      },
      error: (error: any) => {
        console.error('Error al cargar Departamentos:', error);
      }
    });
  }

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/provincia/provincias'];
  }

  // Implementa el método abstracto para guardar la entidad (Actualizar)
  protected override saveEntity(provinciaData: Provincia): Observable<Provincia> {
      if (this.entityId === null) {
        // Esto no debería ocurrir si ngOnInit maneja correctamente la falta de ID, pero es una seguridad
        console.error('Cannot update without an entity ID.');
        // Usa los métodos heredados
        this.showErrorMessage('crud.save_error', { entity: this.translate.instant(this.entityNameKey) });
        return new Observable(); // Retorna un observable vacío o lanza un error
      }
    const params: UpdateProvincia$Params = {
      id: this.entityId, // Usa el entityId heredado
      body: provinciaData
    };
    return this.provinciaService.updateProvincia(params);
  }

  // Implementa el método abstracto para cargar datos en el modo edición
  protected override loadEntityData(id: number): void {
    const params: GetProvinciaById$Params = { id: id };

    this.provinciaService.getProvinciaById(params).subscribe({
      next: (provincia: Provincia) => {
        this.form.patchValue({
          nombre: provincia.nombre,
          departamento: provincia.departamento,
          poblacion: provincia.poblacion || 0,
          superficie: provincia.superficie || 0
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


  compareDepartamentos(option: Departamento | null, formValue: Departamento | null): boolean {
    // Si ambos son null o undefined, considéralos iguales (útil para la opción "None")
    if (!option && !formValue) {
      return true;
    }
    // Si uno es null/undefined y el otro no, no son iguales
    if (!option || !formValue) {
      return false;
    }
    // Compara por el ID único del país
    return option.id === formValue.id;
  }
}
