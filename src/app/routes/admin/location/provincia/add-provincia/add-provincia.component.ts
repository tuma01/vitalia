import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { CreateProvincia$Params } from 'app/services/fn/provincia/create-provincia';
import { Departamento, Provincia } from 'app/services/models';
import { DepartamentoService, ProvinciaService } from 'app/services/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-provincia',
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
  templateUrl: './add-provincia.component.html',
  styleUrl: './add-provincia.component.scss'
})
export class AddProvinciaComponent extends CrudBaseAddEditComponent<Provincia, CreateProvincia$Params, any, any> implements OnInit {

  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    poblacion: [0 , [Validators.pattern(/^[0-9]*$/)]],
    superficie: [0, [Validators.pattern(/^[0-9]*$/)]],
  });
  ngOnInit(): void {
    this.loadData();
  }

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.provincia';

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private provinciaService = inject(ProvinciaService);

  private departamentoService = inject(DepartamentoService);

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['location/provincia/provincias'];
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(provinciaData: Provincia): Observable<Provincia> {
    const params: CreateProvincia$Params = { body: provinciaData };
    return this.provinciaService.createProvincia(params);
  }

    // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
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
}
