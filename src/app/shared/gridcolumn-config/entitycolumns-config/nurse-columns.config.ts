import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { formatPhoneNumberWithIcon } from '@shared/utils/grid-formatters';


export function getNurseColumns(translate: TranslateService): MtxGridColumn[] {

  const datePipe = new DatePipe('en-US'); // or use your locale

  return [
    {
      header: translate.stream('nurse.nombre'),
      field: 'nombre',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '120px',
    },
    {
      header: translate.stream('nurse.apellidoPaterno'),
      field: 'apellidoPaterno',
      minWidth: 120,
      width: '120px',
    },
    {
      header: translate.stream('nurse.apellidoMaterno'),
      field: 'apellidoMaterno',
      minWidth: 120,
      width: '120px',
    },
    {
      header: translate.stream('nurse.genero'),
      field: 'genero',
      minWidth: 120,
      formatter: (rowData: any) => {
        const genero = rowData.genero;
        let textToDisplay = ''; // Declarar aquí si no está ya en el ámbito
        let badgeColorClass = '';
        const baseBadgeClass = 'badge';

        switch (genero) {
          case 'MASCULINO':
            textToDisplay = translate.instant('masculino'); // Usar 'this.translate' si estás en una clase
            badgeColorClass = 'badge-solid-male-green';
            break;
          case 'FEMENINO':
            textToDisplay = translate.instant('femenino');
            badgeColorClass = 'badge-solid-female-violet';
            break;
          case 'DESCONOCIDO':
            textToDisplay = translate.instant('desconocido');
            badgeColorClass = 'badge-solid-unknown-blue'; // Usamos el azul pastel para desconocido
            break;
          default:
            console.warn(`[MtxGridColumn] Valor de género inesperado: "${genero}". Mostrando como "Desconocido".`);
            textToDisplay = translate.instant('desconocido');
            badgeColorClass = 'badge-solid-gray'; // Color de reserva
            break;
        }

        // Retorna el HTML con tus clases de insignia actualizadas
        return `<span class="${baseBadgeClass} ${badgeColorClass}">${textToDisplay}</span>`;
      },



      // type: 'tag', // We are back to using the 'tag' type
      // tag: {
      //   // You can use basic color names, or the hex codes we found before.
      //   // The actual background will be forced by CSS.
      //   MASCULINO: { text: translate.instant('masculino'), color: 'red' },     // Or '#FFCDD2'
      //   FEMENINO: { text: translate.instant('femenino'), color: 'green' },   // Or '#DCEDC8'
      //   DESCONOCIDO: { text: translate.instant('desconocido'), color: 'blue' }, // Or '#BBDEFB'
      // },
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
      header: translate.stream('nurse.email'),
      field: 'email',
      minWidth: 120,
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
      formatter: formatPhoneNumberWithIcon(translate),
      // formatter: (rowData: any) => {
      //   const phoneNumber = rowData.telefono;
      //   if (!phoneNumber) {
      //     return '-';
      //   }

      //   // Aquí, 'phone' es el "código" del ícono de teléfono
      //   return `<span class="material-icons" style="font-size: 18px; vertical-align: middle; margin-right: 5px;">phone</span><a href="tel:${phoneNumber}">${phoneNumber}</a>`;
      // },
    }
  ];
}
