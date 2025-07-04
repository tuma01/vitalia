import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { getBaseColumns, getOperationColumn, PageHeaderComponent } from '@shared';
import { CrudBaseComponent } from '@shared/components/crud-template/crud-base.component';
import { CrudTemplateComponent } from '@shared/components/crud-template/crud-template.component';
import { getNurseColumns } from '@shared/gridcolumn-config/entitycolumns-config/nurse-columns.config';
import { Nurse } from 'app/services/models';
import { NurseService } from 'app/services/services';

@Component({
  selector: 'app-nurses',
  imports: [
    CommonModule,
    PageHeaderComponent,
    CrudTemplateComponent
  ],
  templateUrl: './nurses.component.html',
  styleUrl: './nurses.component.scss'
})
export class NursesComponent extends CrudBaseComponent<Nurse> {

  private nurseService = inject(NurseService);
  translate = inject(TranslateService);

  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  constructor() {
    super({
      columns: [], // Inicializamos vacío y luego actualizamos
      translations: {
        add: 'add',
        entityName: 'entity.nurse',
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
      // ...getBaseColumns(this.translate), // no es necesario si ya tienes las columnas específicas
      ...getNurseColumns(this.translate),
      getOperationColumn(this.translate, {
        editHandler: (record) => this.edit(record),
        deleteHandler: (record) => this.delete(record),
        entityType: 'entity.nurse',  // Tipo de entidad
        fieldForMessage: 'nombre'     // Campo con el nombre específico
      })
    ];
  }

  loadData(): void {
    this.isLoading = true;
    this.nurseService.getAllNurses().subscribe({
      next: (response: Nurse[]) => {
        this.dataList = response;
        this.filteredData = [...this.dataList];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar Enfermeras:', error);
        this.isLoading = false;
      }
    });
  }

  override createNew(): void {
    this.router.navigate(['nurse/addNurse']);
  }

  override edit(record: Nurse): void {
    this.router.navigate(['nurse/editNurse'], {
      queryParams: { id: record.id },
    });
  }

  override delete(record: Nurse): void {
    const ENTITY_NAME = record.nombre || 'el nurse'; // Fallback por si name es undefined
    const SUCCESS_MESSAGE = `"${ENTITY_NAME}" fue eliminado correctamente`;
    const ERROR_BASE = 'No se pudo eliminar la enfermera';

    this.nurseService.deleteNurse({ id: record.id! }).subscribe({
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
