import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getBaseColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { getMunicipioColumns } from '@shared/gridcolumn-config/entitycolumns-config/municipio-columns.config';
import { Municipio } from 'app/services/models/municipio';
// import { Municipio } from 'app/services/models';
import { MunicipioService } from 'app/services/services';

@Component({
  selector: 'app-municipios',
  imports: [
    CommonModule,
    PageHeaderComponent,
    CrudTemplateComponent
  ],
  templateUrl: './municipios.component.html',
  styleUrl: './municipios.component.scss'
})
export class MunicipiosComponent extends CrudBaseComponent<Municipio> {

  private municipioService = inject(MunicipioService);
  translate = inject(TranslateService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
      super({
        columns: [], // Inicializamos vacío y luego actualizamos
        translations: {
          add: 'add',
          entityName: 'entity.municipio',
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
        ...getMunicipioColumns(this.translate),
        getOperationColumn(this.translate, {
          editHandler: (record) => this.edit(record),
          deleteHandler: (record) => this.delete(record),
          entityType: 'entity.municipio',  // Tipo de entidad
          fieldForMessage: 'nombre'     // Campo con el nombre específico
        })
      ];
    }

  loadData(): void {
    this.isLoading = true;
    this.municipioService.getAllMunicipios().subscribe({
      next: (response: Municipio[]) => {
        this.dataList = response;
        this.filteredData = [...this.dataList];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar Municipios:', error);
        this.isLoading = false;
      }
    });
  }

  override createNew(): void {
    this.router.navigate(['location/municipio/addMunicipio']);
  }

  override edit(record: Municipio): void {
    this.router.navigate(['location/municipio/editMunicipio'], {
      queryParams: { id: record.id },
    });
  }

  override delete(record: Municipio): void {
    const ENTITY_NAME = record.nombre || 'el municipio'; // Fallback por si name es undefined
    const SUCCESS_MESSAGE = `"${ENTITY_NAME}" fue eliminado correctamente`;
    const ERROR_BASE = 'No se pudo eliminar el municipio';

    this.municipioService.deleteMunicipio({ id: record.id! }).subscribe({
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
