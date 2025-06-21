import { TranslateService } from '@ngx-translate/core';
import { MtxGridColumn, MtxGridColumnButton, MtxGridButtonType } from '@ng-matero/extensions/grid';
import { ThemePalette } from '@angular/material/core';

// Tipado para botones personalizados
interface CustomButtonOptions {
  icon: string;
  tooltipKey: string;
  handler: (record: any) => void;
  color?: string;
}

interface OperationColumnOptions {
  editHandler?: (record: any) => void;
  deleteHandler?: (record: any) => void;
  customButtons?: CustomButtonOptions[];
  entityType?: string;  // Ej: "DEPARTAMENTO"
  fieldForMessage?: string;   // Ej: "name" (campo del record)
}

// Función principal para generar la columna de operaciones
export function getOperationColumn(
  translate: TranslateService,
  options: OperationColumnOptions
): MtxGridColumn {
  const buttons: MtxGridColumnButton[] = [];

  if (options.editHandler) {
    buttons.push(getEditButton(translate, options.editHandler, options.fieldForMessage));
  }

  if (options.deleteHandler) {
    buttons.push(getDeleteButton(translate, options.deleteHandler, {
      entityType: options.entityType,
      fieldForMessage: options.fieldForMessage
    }));
  }

  if (options.customButtons) {
    buttons.push(...options.customButtons.map(btn =>
      getCustomButton(translate, btn.icon, btn.tooltipKey, btn.handler, btn.color)
    ));
  }

  return {
    header: translate.stream('common.operations'),
    field: 'operation',
    minWidth: 150,
    width: '10%',
    pinned: 'right',
    type: 'button',
    buttons,
  };
}

// Botón de edición (tipado explícito)
function getEditButton(
  translate: TranslateService, handler: (record: any) => void, fieldForMessage: string | undefined
): MtxGridColumnButton {
  return {
    type: 'icon' as MtxGridButtonType, // ¡Tipo específico!
    icon: 'edit',
    tooltip: translate.stream('edit'),
    click: handler,
  };
}

// Botón de eliminación (tipado explícito)
function getDeleteButton(
  translate: TranslateService,
  handler: (record: any) => void,
  options: {
    entityType?: string;
    fieldForMessage?: string;
  }
): MtxGridColumnButton {
  return {
    type: 'icon' as MtxGridButtonType,
    icon: 'delete',
    color: 'warn',
    tooltip: translate.stream('delete'),
    click: (record) => {
      let message: string;
      if (options.entityType && options.fieldForMessage) {
        message = translate.instant('confirm_delete', { entityType: translate.instant(options.entityType), fieldValue: record[options.fieldForMessage] });
      } else {
        message = translate.instant('confirm_delete_generic');
      }
      if (confirm(message)) {
        handler(record);
      }
    },
  };
}

// Botón personalizado (tipado explícito)
function getCustomButton(
  translate: TranslateService,
  icon: string,
  tooltipKey: string,
  handler: (record: any) => void,
  color?: string
): MtxGridColumnButton {
  const allowedColors: ThemePalette[] = ['primary', 'accent', 'warn'];
  const validatedColor = color && allowedColors.includes(color as ThemePalette)
    ? color as ThemePalette
    : undefined;

  return {
    type: 'icon' as MtxGridButtonType,
    icon,
    tooltip: translate.stream(tooltipKey),
    color: validatedColor,
    click: handler,
  };
}
