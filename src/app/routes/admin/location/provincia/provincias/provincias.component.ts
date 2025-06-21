import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getBaseColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { getProvinciaColumns } from '@shared/gridcolumn-config/entitycolumns-config/provincia-columns.config';
import { Provincia } from 'app/services/models';
import { ProvinciaService } from 'app/services/services';

@Component({
  selector: 'app-provincias',
  imports: [
    PageHeaderComponent,
    CrudTemplateComponent
  ],
  templateUrl: './provincias.component.html',
  styleUrl: './provincias.component.scss'
})
export class ProvinciasComponent extends CrudBaseComponent<Provincia> {
  private provinciaService = inject(ProvinciaService);
  translate = inject(TranslateService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    super({
      columns: [], // Inicializamos vacío y luego actualizamos
      translations: {
        add: 'add',
        entityName: 'entity.provincia',
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
          ...getProvinciaColumns(this.translate),
          getOperationColumn(this.translate, {
            editHandler: (record) => this.edit(record),
            deleteHandler: (record) => this.delete(record),
            entityType: 'entity.provincia',  // Tipo de entidad
            fieldForMessage: 'nombre'     // Campo con el nombre específico
          })
        ];
      }

  loadData(): void {
    this.isLoading = true;
        this.provinciaService.getAllProvincias().subscribe({
          next: (response: Provincia[]) => {
            this.dataList = response;
            this.filteredData = [...this.dataList];
            this.isLoading = false;
          },
          error: (error: any) => {
            console.error('Error al cargar provincias:', error);
            this.isLoading = false;
          }
        });
  }
  createNew(): void {
    this.router.navigate(['location/provincia/addProvincia']);
  }

  edit(record: Provincia): void {
    this.router.navigate(['location/provincia/editProvincia'], {
      queryParams: { id: record.id },
    });
  }
  delete(record: Provincia): void {
    const ENTITY_NAME = record.nombre || 'la Provincia'; // Fallback por si name es undefined
    const SUCCESS_MESSAGE = `"${ENTITY_NAME}" fue eliminado correctamente`;
    const ERROR_BASE = 'No se pudo eliminar la provincia';

    this.provinciaService.deleteProvincia({ id: record.id! }).subscribe({
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


