import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { GetMunicipioById$Params } from 'app/services/fn/municipio/get-municipio-by-id';
import { UpdateMunicipio$Params } from 'app/services/fn/municipio/update-municipio';
import { GetProvinciaById$Params } from 'app/services/fn/provincia/get-provincia-by-id';
import { Municipio, Provincia } from 'app/services/models';
import { MunicipioService, ProvinciaService } from 'app/services/services';
import { Observable } from 'rxjs';

interface MunicipioFormControls {
  nombre: FormControl<string>;
  provincia: FormControl<Provincia | null>; // Explicitly define that country can be Country or null
  poblacion: FormControl<number>;
  superficie: FormControl<number>;
  codigoMunicipio: FormControl<number>;
  direccion: FormControl<string>;
}

@Component({
  selector: 'app-edit-municipio',
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
  templateUrl: './edit-municipio.component.html',
  styleUrl: './edit-municipio.component.scss'
})
export class EditMunicipioComponent extends CrudBaseAddEditComponent<Municipio, any, UpdateMunicipio$Params, GetMunicipioById$Params> implements OnInit {

  protected override form = this.fb.group<MunicipioFormControls>({
    nombre: this.fb.nonNullable.control('', [Validators.required]),
    provincia: this.fb.control<Provincia | null>(null, [Validators.required]), // Allow null initially, but expect Country
    poblacion: this.fb.nonNullable.control(0, [Validators.pattern(/^[0-9]*$/)]),
    superficie: this.fb.nonNullable.control(0, [Validators.pattern(/^[0-9]*$/)]),
    codigoMunicipio: this.fb.nonNullable.control(0, [Validators.pattern(/^[0-9]*$/)]),
    direccion: this.fb.nonNullable.control('')
  });

  protected override entityNameKey = 'entity.municipio';
  private provinciaService = inject(ProvinciaService);
  private municipioService = inject(MunicipioService);

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

  provinciaList: Provincia[] = [];
  loadData(): void {
    this.provinciaService.getAllProvincias().subscribe({
      next: (response: Provincia[]) => {
        this.provinciaList = response;
      },
      error: (error: any) => {
        console.error('Error al cargar Provincias:', error);
      }
    });
  }

  // protected form: FormGroup<any>;
  // protected entityNameKey: string;
  protected getSuccessRoute(): any[] {
    return ['location/municipio/municipios'];
  }
  protected saveEntity(municipioData: Municipio): Observable<Municipio> {
    if (this.entityId === null) {
        // Esto no debería ocurrir si ngOnInit maneja correctamente la falta de ID, pero es una seguridad
        console.error('Cannot update without an entity ID.');
        // Usa los métodos heredados
        this.showErrorMessage('crud.save_error', { entity: this.translate.instant(this.entityNameKey) });
        return new Observable(); // Retorna un observable vacío o lanza un error
      }
    const params: UpdateMunicipio$Params = {
      id: this.entityId, // Usa el entityId heredado
      body: municipioData
    };
    return this.municipioService.updateMunicipio(params);
  }
  protected loadEntityData(id: any): void {
    const params: GetMunicipioById$Params = { id: id };

    this.municipioService.getMunicipioById(params).subscribe({
      next: (municipio: Municipio) => {
        this.form.patchValue({
          nombre: municipio.nombre,
          provincia: municipio.provincia,
          poblacion: municipio.poblacion || 0,
          superficie: municipio.superficie || 0,
          codigoMunicipio: municipio.codigoMunicipio || 0,
          direccion: municipio.direccion || ''
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

  compareProvincia(option: Provincia | null, formValue: Provincia | null): boolean {
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
