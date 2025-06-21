import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getDepartamentoColumns(translate: TranslateService): MtxGridColumn[] {
  return [
    {
      header: translate.stream('departamento.nombre'),
      field: 'nombre',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '300px',
    },
    {
      header: translate.stream('departamento.poblacion'),
      field: 'poblacion',
      minWidth: 100,
    },
    {
      header: translate.stream('departamento.superficie'),
      field: 'superficie',
      minWidth: 120,
    },
    {
      header: translate.stream('departamento.pais'),
      field: 'country.name',
      minWidth: 120,
    }
  ];
}
