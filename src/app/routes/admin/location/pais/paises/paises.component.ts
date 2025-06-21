import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { getBaseColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { getPaisColumns } from '@shared/gridcolumn-config/entitycolumns-config/pais-columns.config';
import { Country } from 'app/services/models';
import { CountryService } from 'app/services/services';

@Component({
  selector: 'app-paises',
  imports: [
    PageHeaderComponent,
    CrudTemplateComponent
  ],
  templateUrl: './paises.component.html',
  styleUrl: './paises.component.scss'
})
export class PaisesComponent extends CrudBaseComponent<Country> {
  private countryService = inject(CountryService);
  translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {

      super({
        columns: [], // Inicializamos vacío y luego actualizamos
        translations: {
          add: 'add',
          entityName: 'entity.country',
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
        ...getPaisColumns(this.translate),
        getOperationColumn(this.translate, {
          editHandler: (record) => this.edit(record),
          deleteHandler: (record) => this.delete(record),
          entityType: 'entity.country',  // Tipo de entidad
          fieldForMessage: 'name'     // Campo con el nombre específico
        })
      ];
    }


    override loadData(): void {
      this.isLoading = true;
      this.countryService.getAllCountries().subscribe({
        next: (response: Country[]) => {
          this.dataList = response;
          this.filteredData = [...this.dataList];
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error al cargar Paises:', error);
          this.isLoading = false;
        }
      });
    }

    override createNew(): void {
      this.router.navigate(['location/pais/addPais']);
    }

    override edit(record: Country): void {
      // this.router.navigate(['admin/pais/editPais']);
      this.router.navigate(['location/pais/editPais'], {
        queryParams: { id: record.id },
      });
    }

    override delete(record: Country): void {
      const COUNTRY_NAME = record.name || 'el país'; // Fallback por si name es undefined
      const SUCCESS_MESSAGE = `"${COUNTRY_NAME}" fue eliminado correctamente`;
      const ERROR_BASE = 'No se pudo eliminar el país';

      this.countryService.deleteCountry({ id: record.id! }).subscribe({
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
              console.error(`Error eliminando país ID ${record.id}:`, error);
          }
      });
  }
}
