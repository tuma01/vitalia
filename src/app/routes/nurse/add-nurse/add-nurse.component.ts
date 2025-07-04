import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';
import { CrudBaseAddEditComponent } from '@shared/components/crud-template/crud-base-add-edit.component';
import { CreateMunicipio$Params } from 'app/services/fn/municipio/create-municipio';
import { CreateNurse$Params } from 'app/services/fn/nurse/create-nurse';
import { Municipio, Nurse, NurseProfessionSpeciality, Provincia } from 'app/services/models';
import { MunicipioService, NurseProfessionSpecialityService, NurseService } from 'app/services/services';
import { te } from 'date-fns/locale';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-nurse',
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
    MatTabsModule,
    MatButtonToggleModule
  ],
  templateUrl: './add-nurse.component.html',
  styleUrl: './add-nurse.component.scss'
})
export class AddNurseComponent extends CrudBaseAddEditComponent<Nurse, CreateNurse$Params, any, any> implements OnInit {
  mainForm!: FormGroup;
  constructor(protected fb: FormBuilder) {
    super();
  }

  genderOptions: ('masculino' | 'femenino' | 'desconocido')[] = ['masculino', 'femenino', 'desconocido'];


  // Define el formulario específico para País
  protected override form = this.fb.nonNullable.group({
    tab1Form: this.fb.group({
        nombre: ['', [Validators.required]],
        apellidoMaterno: ['', [Validators.required]],
        apellidoPaterno: ['', [Validators.required]],
        anoNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
        celular: [''],
        diaNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
        // estadoCivil: ['', [Validators.required]],
        fechaNacimiento: [0 , [Validators.required]],
        genero: [null, Validators.required],
        nurseProfessionSpecialities: [null, Validators.required],
        telephone: [null],
      }),
      tab2Form: this.fb.group({
        field2: ['1234567', [Validators.required, Validators.minLength(3)]] // Campo requerido y con longitud mínima para el Tab 2
      }),
      tab3Form: this.fb.group({
        field3: ['juan.amachi@gmail.com', [Validators.required, Validators.email]] // Campo requerido y con formato de email para el Tab 3
      })
    // nombre: ['', [Validators.required]],
    // apellidoMaterno: ['', [Validators.required]],
    // apellidoPaterno: ['', [Validators.required]],
    // anoNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
    // celular: [''],
    // diaNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
    // estadoCivil: ['', [Validators.required]],
    // poblfechaNacimientoacion: [0 , [Validators.pattern(/^[0-9]*$/)]],
    // genero: [null, Validators.required],
    // idCard: ['', [Validators.required]],
    // mesNacimiento: [0 , [Validators.pattern(/^[0-9]*$/)]],
    // fechaNacimiento: [null],
    // nurseProfessionSpecialities: [[]],
    // personType: [''],
    // photo: [''],
    // segundoNombre: [''],
    // telefono: ['']
  });

  ngOnInit(): void {

    // this.mainForm = this.fb.group({
    //   tab1Form: this.fb.group({
    //     field1: ['', Validators.required] // Campo requerido para el Tab 1
    //   }),
    //   tab2Form: this.fb.group({
    //     field2: ['', [Validators.required, Validators.minLength(3)]] // Campo requerido y con longitud mínima para el Tab 2
    //   }),
    //   tab3Form: this.fb.group({
    //     field3: ['', [Validators.required, Validators.email]] // Campo requerido y con formato de email para el Tab 3
    //   })
    // });


    this.loadData();
  }

  // Método que se ejecuta al hacer submit. Solo se llamará si el formulario es válido.
  onSubmit(): void {
    if (this.mainForm && this.mainForm.valid) {
      console.log('Formulario válido. Datos enviados:', this.mainForm.value);
      alert('¡Formulario enviado correctamente!');
      // Aquí iría la lógica para enviar los datos al servidor.
    } else {
      console.log('Formulario inválido. Por favor, revisa los campos.');
      alert('Por favor, completa todos los campos requeridos.');
    }
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
