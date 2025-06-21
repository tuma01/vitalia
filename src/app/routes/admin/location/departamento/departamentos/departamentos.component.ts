import { Component, OnInit, inject } from '@angular/core';
import { getBaseColumns, getDepartamentoColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { Departamento } from 'app/services/models';
import { DepartamentoService } from 'app/services/services';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
// import { CrudTemplateComponent } from "../../../../shared/components/crud-template/crud-template.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';


@Component({
  selector: 'app-departamentos',
  imports: [
    PageHeaderComponent,
    CrudTemplateComponent
],
  templateUrl: './departamentos.component.html',
  styleUrl: './departamentos.component.scss'
})
export class DepartamentosComponent extends CrudBaseComponent<Departamento> {
  private departamentoService = inject(DepartamentoService);
  translate = inject(TranslateService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    super({
      columns: [], // Inicializamos vacío y luego actualizamos
      translations: {
        add: 'add',
        entityName: 'entity.departamento',
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
      ...getDepartamentoColumns(this.translate),
      getOperationColumn(this.translate, {
        editHandler: (record) => this.edit(record),
        deleteHandler: (record) => this.delete(record),
        entityType: 'entity.departamento',  // Tipo de entidad
        fieldForMessage: 'nombre'     // Campo con el nombre específico
      })
    ];
  }



  override loadData(): void {
    this.isLoading = true;
    this.departamentoService.getAllDepartamentos().subscribe({
      next: (response: Departamento[]) => {
        this.dataList = response;
        this.filteredData = [...this.dataList];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar departamentos:', error);
        this.isLoading = false;
      }
    });
  }

  override createNew(): void {
    this.router.navigate(['location/departamento/addDepartamento']);
  }

  override edit(record: Departamento): void {
    this.router.navigate(['location/departamento/editDepartamento'], {
      queryParams: { id: record.id },
    });
  }

  override delete(record: Departamento): void {
    const ENTITY_NAME = record.nombre || 'el departamento'; // Fallback por si name es undefined
    const SUCCESS_MESSAGE = `"${ENTITY_NAME}" fue eliminado correctamente`;
    const ERROR_BASE = 'No se pudo eliminar el departamento';

    this.departamentoService.deleteDepartamento({ id: record.id! }).subscribe({
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
