// src/app/shared/utils/grid-formatters.ts (o donde definas tus columnas)

import { TranslateService } from '@ngx-translate/core'; // Asegúrate de importar TranslateService

/**
 * Returns a formatter function for MtxGridColumn to display a phone number with an icon.
 * @param translate The TranslateService instance for internationalization.
 * @returns A formatter function that takes rowData and returns HTML string.
 */
export function formatPhoneNumberWithIcon(translate: TranslateService) {
  return (rowData: any): string => {
    const phoneNumber = rowData.telefono;

    if (!phoneNumber) {
      return `<span style="color: #9E9E9E;">- ${translate.instant('nurse.no_telefono_disponible')}</span>`;
    }

    // Estilos CSS para el ícono y el contenedor
    const iconStyle = `
      font-size: 18px;            /* Tamaño del ícono */
      vertical-align: middle;     /* Alinea el ícono con el texto */
      margin-right: 6px;          /* Espacio entre el ícono y el número */
      /* ¡QUITAR CUALQUIER PROPIEDAD 'color' DE AQUÍ! */
    `;

    const textStyle = `
      color: #333;                /* Color del texto del número de teléfono */
      white-space: nowrap;        /* Evita que el número se divida en varias líneas */
    `;

    // Retorna el HTML con el ícono y el número de teléfono, sin enlace
    return `
      <span style="${textStyle}">
        <span class="material-icons" style="${iconStyle}">phone</span>
        ${phoneNumber}
      </span>
    `;
  };
}
