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
import { Country } from 'app/services/models/country';
import { CountryService, DepartamentoService } from 'app/services/services';
import { CommonModule } from '@angular/common';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { Observable } from 'rxjs';
import { Departamento } from 'app/services/models';
import { CreateDepartamento$Params } from 'app/services/fn/departamento/create-departamento';

@Component({
  selector: 'app-add-departamento',
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
  templateUrl: './add-departamento.component.html',
  styleUrl: './add-departamento.component.scss'
})
export class AddDepartamentoComponent extends CrudBaseAddEditComponent<Departamento, CreateDepartamento$Params, any, any> implements OnInit {

  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    country: ['', [Validators.required]],
    poblacion: [0 , [Validators.pattern(/^[0-9]*$/)]],
    superficie: [0, [Validators.pattern(/^[0-9]*$/)]],
  });

  ngOnInit(): void {
    this.loadData();
  }

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.departamento';

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private departamentoService = inject(DepartamentoService);

  private countryService = inject(CountryService);

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/departamento/departamentos'];
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(departamentoData: Departamento): Observable<Departamento> {
    const params: CreateDepartamento$Params = { body: departamentoData };
    return this.departamentoService.createDepartamento(params);
  }

   // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
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
}
