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
import { CreateMunicipio$Params } from 'app/services/fn/municipio/create-municipio';
import { Municipio, Provincia } from 'app/services/models';
import { ProvinciaService, MunicipioService } from 'app/services/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-municipio',
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
  templateUrl: './add-municipio.component.html',
  styleUrl: './add-municipio.component.scss'
})
export class AddMunicipioComponent extends CrudBaseAddEditComponent<Municipio, CreateMunicipio$Params, any, any> implements OnInit {

  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    direccion: [''],
    provincia: ['', [Validators.required]],
    poblacion: [0 , [Validators.pattern(/^[0-9]*$/)]],
    superficie: [0, [Validators.pattern(/^[0-9]*$/)]],
    codigoMunicipio: [0 , [Validators.pattern(/^[0-9]*$/)]],
  });

  ngOnInit(): void {
    this.loadData();
  }

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.municipio';

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private provinciaService = inject(ProvinciaService);

  private municipioService = inject(MunicipioService);

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/provincia/provincias'];
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(municipioData: Municipio): Observable<Municipio> {
    const params: CreateMunicipio$Params = { body: municipioData };
    return this.municipioService.createMunicipio(params);
  }

    // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
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

}
