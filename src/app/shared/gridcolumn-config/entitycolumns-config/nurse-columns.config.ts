import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';


export function getNurseColumns(translate: TranslateService): MtxGridColumn[] {

  const datePipe = new DatePipe('en-US'); // or use your locale

  return [
    {
      header: translate.stream('nurse.nombre'),
      field: 'nombre',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '200px',
    },

    {
      header: translate.stream('nurse.apellidoMaterno'),
      field: 'apellidoMaterno',
      minWidth: 100,
    },
    {
      header: translate.stream('nurse.apellidoPaterno'),
      field: 'apellidoPaterno',
      minWidth: 120,
    },
    {
      header: translate.stream('nurse.fechaNacimiento'),
      field: 'fechaNacimiento',
      minWidth: 120,

      // formatter: (rowData: any) => {
      //   const fecha = rowData.fechaNacimiento;

      //   if (fecha) {
      //     const currentLang = translate.currentLang || 'en-US';
      //     return datePipe.transform(fecha, 'dd/MM/yyyy', currentLang) || 'N/A';
      //   }
      //   return 'N/A'; // O cualquier valor por defecto si la fecha es nula/inválida
      // },
    },
    {
      header: translate.stream('nurse.idCard'),
      field: 'idCard',
      minWidth: 120,
    },
    {
      header: translate.stream('nurse.nurseProfessionSpecialities'),
      field: 'nurseProfessionSpecialities',
      minWidth: 120,
      formatter: (rowData: any) => {
        // rowData es una instancia de Nurse.
        // Accedemos directamente a nurseProfessionSpecialities desde rowData.
        const specialties = rowData.nurseProfessionSpecialities;

        if (specialties && Array.isArray(specialties) && specialties.length > 0) {
          // Mapeamos cada objeto NurseProfessionSpeciality para obtener su 'name'
          return specialties.map((s: any) => "- " +s.name).join('<br>');
        }
        return 'N/A'; // O un mensaje por defecto si no hay especialidades
      },
    },
    {
      header: translate.stream('nurse.telefono'),
      field: 'telefono',
      minWidth: 120,
    },
    {
      header: translate.stream('nurse.celular'),
      field: 'celular',
      minWidth: 120,
    },
  ];
}
