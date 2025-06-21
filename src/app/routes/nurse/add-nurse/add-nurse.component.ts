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
import { CreateNurse$Params } from 'app/services/fn/nurse/create-nurse';
import { Municipio, Nurse, NurseProfessionSpeciality, Provincia } from 'app/services/models';
import { MunicipioService, NurseProfessionSpecialityService, NurseService } from 'app/services/services';
import { te } from 'date-fns/locale';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-nurse',
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
  templateUrl: './add-nurse.component.html',
  styleUrl: './add-nurse.component.scss'
})
export class AddNurseComponent extends CrudBaseAddEditComponent<Nurse, CreateNurse$Params, any, any> implements OnInit {

  // Define el formulario específico para País
    protected override form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellidoMaterno: ['', [Validators.required]],
    apellidoPaterno: ['', [Validators.required]],
    anoNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
    celular: [''],
    diaNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
    estadoCivil: ['', [Validators.required]],
    poblfechaNacimientoacion: [0 , [Validators.pattern(/^[0-9]*$/)]],
    genero: [''],
    idCard: ['', [Validators.required]],
    mesNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
    nurseProfessionSpecialities: [[]],
    personType: [''],
    photo: [''],
    segundoNombre: [''],
    telefono: ['']
  });

  ngOnInit(): void {
    this.loadData();
  }

  // Define la clave de traducción para el nombre de la entidad
  protected override entityNameKey = 'entity.nurse';

  // Inyecta el servicio específico de País (además de los inyectados en la base)
  private nurseService = inject(NurseService);

  private professionSpecialityService = inject(NurseProfessionSpecialityService);

  // Implementa el método abstracto para definir la ruta de éxito
  protected override getSuccessRoute(): any[] {
    return ['nurse/nurses'];
  }

  // Implementa el método abstracto para guardar la entidad (Crear)
  protected override saveEntity(nurseData: Nurse): Observable<Nurse> {
    const params: CreateNurse$Params = { body: nurseData };
    return this.nurseService.createNurse(params);
  }

    // Implementa el método abstracto para cargar datos (no necesario en Add, se puede dejar vacío)
  protected override loadEntityData(id: any): void {
    // No implementado para el componente de adición
  }

  professionSpecialityList: NurseProfessionSpeciality[] = [];
  loadData(): void {
    this.professionSpecialityService.getAllNurseProfessionSpecialities().subscribe({
      next: (response: NurseProfessionSpeciality[]) => {
        this.professionSpecialityList = response;
      },
      error: (error: any) => {
        console.error('Error al cargar Provincias:', error);
      }
    });
  }
}
