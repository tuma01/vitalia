import { Component, inject } from '@angular/core';
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
import { Country } from 'app/services/models/country';
import { CountryService } from 'app/services/services';
import { CommonModule } from '@angular/common';
import { CreateCountry$Params } from 'app/services/fn/country/create-country';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-pais',
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
  templateUrl: './add-pais.component.html',
  styleUrl: './add-pais.component.scss'
})
export class AddPaisComponent extends CrudBaseAddEditComponent<Country, CreateCountry$Params, any, any> {

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

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private countryService = inject(CountryService);

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/pais/paises'];
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(countryData: Country): Observable<Country> {
    const params: CreateCountry$Params = { body: countryData };
    return this.countryService.createCountry(params);
  }

   // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
  }

}
