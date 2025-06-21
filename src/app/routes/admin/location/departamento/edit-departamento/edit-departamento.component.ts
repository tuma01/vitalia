import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { GetDepartamentoById$Params } from 'app/services/fn/departamento/get-departamento-by-id';
import { UpdateDepartamento$Params } from 'app/services/fn/departamento/update-departamento';
import { Country, Departamento } from 'app/services/models';
import { CountryService, DepartamentoService } from 'app/services/services';
import { Observable } from 'rxjs';


interface DepartamentoFormControls {
  nombre: FormControl<string>;
  country: FormControl<Country | null>; // Explicitly define that country can be Country or null
  poblacion: FormControl<number>;
  superficie: FormControl<number>;
}

@Component({
  selector: 'app-edit-departamento',
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
  templateUrl: './edit-departamento.component.html',
  styleUrl: './edit-departamento.component.scss'
})
export class EditDepartamentoComponent extends CrudBaseAddEditComponent<Departamento, any, UpdateDepartamento$Params, GetDepartamentoById$Params> implements OnInit {
  // protected override form!: FormGroup<DepartamentoFormControls>;
  // protected override form = this.fb.nonNullable.group({
  //   nombre: ['', [Validators.required]],
  //   country: [ null, [Validators.required]],
  //   poblacion: [0 , [Validators.pattern(/^[0-9]*$/)]],
  //   superficie: [0, [Validators.pattern(/^[0-9]*$/)]],
  // });

  protected override form = this.fb.group<DepartamentoFormControls>({
    nombre: this.fb.nonNullable.control('', [Validators.required]),
    country: this.fb.control<Country | null>(null, [Validators.required]), // Allow null initially, but expect Country
    poblacion: this.fb.nonNullable.control(0 , [Validators.pattern(/^[0-9]*$/)]),
    superficie: this.fb.nonNullable.control(0, [Validators.pattern(/^[0-9]*$/)]),
  });

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.departamento';
  private departamentoService = inject(DepartamentoService);
  private countryService = inject(CountryService);

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
  countryList: Country[] = [];
  loadData(): void {
    this.countryService.getAllCountries().subscribe({
      next: (response: Country[]) => {
        this.countryList = response;
      },
      error: (error: any) => {
        console.error('Error al cargar Paises:', error);
      }
    });
  }

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/departamento/departamentos'];
  }

  // Implementa el método abstracto para guardar la entidad (Actualizar)
  protected override saveEntity(departamentoData: Departamento): Observable<Departamento> {
      if (this.entityId === null) {
        // Esto no debería ocurrir si ngOnInit maneja correctamente la falta de ID, pero es una seguridad
        console.error('Cannot update without an entity ID.');
        // Usa los métodos heredados
        this.showErrorMessage('crud.save_error', { entity: this.translate.instant(this.entityNameKey) });
        return new Observable(); // Retorna un observable vacío o lanza un error
      }
    const params: UpdateDepartamento$Params = {
      id: this.entityId, // Usa el entityId heredado
      body: departamentoData
    };
    return this.departamentoService.updateDepartamento(params);
  }

  // Implementa el método abstracto para cargar datos en el modo edición
  protected override loadEntityData(id: number): void {
    const params: GetDepartamentoById$Params = { id: id };

    this.departamentoService.getDepartamentoById(params).subscribe({
      next: (departamento: Departamento) => {
        this.form.patchValue({
          nombre: departamento.nombre,
          country: departamento.country,
          poblacion: departamento.poblacion || 0,
          superficie: departamento.superficie || 0
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


  compareCountries(option: Country | null, formValue: Country | null): boolean {
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
