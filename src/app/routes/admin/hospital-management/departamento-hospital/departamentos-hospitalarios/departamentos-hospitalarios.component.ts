import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getBaseColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { getDepartamentoHospitalColumns } from '@shared/gridcolumn-config/entitycolumns-config/departamentoHospital-columns.config';
import { DepartamentoHospital } from 'app/services/models';
import { DepartamentoHospitalService } from 'app/services/services';

@Component({
  selector: 'app-departamentos-hospitalarios',
  imports: [
    PageHeaderComponent,
    CrudTemplateComponent
  ],
  templateUrl: './departamentos-hospitalarios.component.html',
  styleUrl: './departamentos-hospitalarios.component.scss'
})
export class DepartamentosHospitalariosComponent extends CrudBaseComponent<DepartamentoHospital> {

  private departamentoHospitalService = inject(DepartamentoHospitalService);
  translate = inject(TranslateService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar)

  constructor() {
    super({
      columns: [], // Inicializamos vacío y luego actualizamos
      translations: {
        add: 'add',
        entityName: 'entity.departamentoHospital',
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
      // ...getBaseColumns(this.translate),
      ...getDepartamentoHospitalColumns(this.translate),
      getOperationColumn(this.translate, {
        editHandler: (record) => this.edit(record),
        deleteHandler: (record) => this.delete(record),
        entityType: 'entity.departamentoHospital',  // Tipo de entidad
        fieldForMessage: 'name'     // Campo con el nombre específico
      })
    ];
  }

  loadData(): void {
    this.isLoading = true;
    this.departamentoHospitalService.getAllDepartamentoHospital().subscribe({
      next: (response: DepartamentoHospital[]) => {
        this.dataList = response;
        this.filteredData = [...this.dataList];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar los departamentos hospitalarios:', error);
        this.isLoading = false;
      }
    });
  }

  createNew(): void {
    this.router.navigate(['hospital-management/departamento-hospital/add-departamento-hospital']);
  }

  edit(record: DepartamentoHospital): void {
    this.router.navigate(['hospital-management/departamento-hospital/edit-departamento-hospital'], {
      queryParams: { id: record.id },
    });
  }

  delete(record: DepartamentoHospital): void {
    const ENTITY_NAME = record.name || 'el Departamento Hospitalario'; // Fallback por si name es undefined
    const SUCCESS_MESSAGE = `"${ENTITY_NAME}" fue eliminado correctamente`;
    const ERROR_BASE = 'No se pudo eliminar "${ENTITY_NAME}"';

    this.departamentoHospitalService.deleteDepartamentoHospital({ id: record.id! }).subscribe({
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
