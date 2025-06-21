import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getProvinciaColumns(translate: TranslateService): MtxGridColumn[] {
  return [
    {
      header: translate.stream('provincia.nombre'),
      field: 'nombre',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '300px',
    },
    {
      header: translate.stream('provincia.poblacion'),
      field: 'poblacion',
      minWidth: 100,
    },
    {
      header: translate.stream('provincia.superficie'),
      field: 'superficie',
      minWidth: 120,
    },
    {
      header: translate.stream('provincia.departamento'),
      field: 'departamento.nombre',
      minWidth: 120,
    }
  ];
}
