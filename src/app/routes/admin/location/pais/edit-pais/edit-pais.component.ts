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
import { GetCountryById$Params } from 'app/services/fn/country/get-country-by-id';
import { UpdateCountry$Params } from 'app/services/fn/country/update-country';
import { Country } from 'app/services/models';
import { CountryService } from 'app/services/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-pais',
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
  templateUrl: './edit-pais.component.html',
  styleUrl: './edit-pais.component.scss'
})
export class EditPaisComponent extends CrudBaseAddEditComponent<Country, any, UpdateCountry$Params, GetCountryById$Params> implements OnInit {

  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    iso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    iso3: ['', [Validators.minLength(3), Validators.maxLength(3)]],
    name: ['', [Validators.required]],
    niceName: ['', [Validators.required]],
    numCode: [0 , [Validators.pattern(/^[0-9]*$/)]],
    phoneCode: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
  });

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.country';


  // --- ELIMINA ESTA LÍNEA ---
  // Propiedad específica de Edit para almacenar el ID
  // private entityId: number | null = null;
  // -------------------------

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private countryService = inject(CountryService);

  // Implementa OnInit para cargar los datos al inicializar el componente
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

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/pais/paises'];
  }

  // Implementa el método abstracto para guardar la entidad (Actualizar)
  protected override saveEntity(countryData: Country): Observable<Country> {
     if (this.entityId === null) {
       // Esto no debería ocurrir si ngOnInit maneja correctamente la falta de ID, pero es una seguridad
       console.error('Cannot update without an entity ID.');
       // Usa los métodos heredados
       this.showErrorMessage('crud.save_error', { entity: this.translate.instant(this.entityNameKey) });
       return new Observable(); // Retorna un observable vacío o lanza un error
     }
    const params: UpdateCountry$Params = {
      id: this.entityId, // Usa el entityId heredado
      body: countryData
    };
    return this.countryService.updateCountry(params);
  }

  // Implementa el método abstracto para cargar datos en el modo edición
  protected override loadEntityData(id: number): void {
    const params: GetCountryById$Params = { id: id };

    this.countryService.getCountryById(params).subscribe({
      next: (country: Country) => {
        this.form.patchValue({
          iso: country.iso,
          iso3: country.iso3,
          name: country.name,
          niceName: country.niceName,
          numCode: country.numCode || 0,
          phoneCode: country.phoneCode || 0
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

  // Opcional: puedes agregar métodos específicos de EditPaisComponent aquí
}
