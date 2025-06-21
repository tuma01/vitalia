import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getBaseColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { getDoctorProfessionSpecialityColumns } from '@shared/gridcolumn-config/entitycolumns-config/doctorProfessionSpeciality-columns.config';
import { DoctorProfessionSpeciality } from 'app/services/models';
import { DoctorProfessionSpecialityService } from 'app/services/services';

@Component({
  selector: 'app-especialidades',
  imports: [
    PageHeaderComponent,
    CrudTemplateComponent
  ],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss'
})
export class EspecialidadesComponent extends CrudBaseComponent<DoctorProfessionSpeciality> {


  private doctorProfessionSpecialityService = inject(DoctorProfessionSpecialityService);
  translate = inject(TranslateService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    super({
      columns: [], // Inicializamos vacío y luego actualizamos
      translations: {
        add: 'add',
        entityName: 'entity.doctorProfessionSpeciality',
        searchPlaceholder: 'common.searchPlaceholder'
      },
      table: {
        pageSize: 10,
        rowStriped: true,
        columnPinnable: true
      }
    });

    // Dentro de tu componente:
    this.columns = [
      ...getBaseColumns(this.translate),
      ...getDoctorProfessionSpecialityColumns(this.translate),
      getOperationColumn(this.translate, {
        editHandler: (record) => this.edit(record),
        deleteHandler: (record) => this.delete(record),
        entityType: 'entity.doctorProfessionSpeciality',  // Tipo de entidad
        fieldForMessage: 'name'     // Campo con el nombre específico
      })
    ];
  }

  override loadData(): void {
    this.isLoading = true;
    this.doctorProfessionSpecialityService.getAllDoctorProfessionSpecialities().subscribe({
      next: (response: DoctorProfessionSpeciality[]) => {
        this.dataList = response;
        this.filteredData = [...this.dataList];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar doctor profession speciality:', error);
        this.isLoading = false;
      }
    });
  }

  createNew(): void {
    this.router.navigate(['medico/especialidad/addEspecialidad']);
  }

  edit(record: DoctorProfessionSpeciality): void {
    this.router.navigate(['medico/especialidad/editEspecialidad'], {
      queryParams: { id: record.id },
    });
  }

  delete(record: DoctorProfessionSpeciality): void {
    const ENTITY_NAME = record.name || 'la specialidad del doctor'; // Fallback por si name es undefined
    const SUCCESS_MESSAGE = `"${ENTITY_NAME}" fue eliminado correctamente`;
    const ERROR_BASE = 'No se pudo eliminar "${ENTITY_NAME}"';

    this.doctorProfessionSpecialityService.deleteDoctorProfessionSpeciality({ id: record.id! }).subscribe({
      next: () => {
          // Mensaje de éxito más descriptivo
          this.snackBar.open(SUCCESS_MESSAGE, 'Cerrar', {
              duration: 4000,
              panelClass: ['success-snackbar']
          });

          this.loadData(); // Recargar datos después del mensaje
      },
      error: (error: HttpErrorResponse) => {
          // Mensaje de error mejorado
          const errorDetail = error.error?.message || 'Por favor, inténtalo nuevamente';
          this.snackBar.open(
              `${ERROR_BASE}: ${errorDetail}`,
              'Cerrar',
              {
                  duration: 6000,
                  panelClass: ['error-snackbar']
              }
          );
          console.error(`Error eliminando ` + ENTITY_NAME + ` ID ${record.id}:`, error);
      }
    });
  }
}



