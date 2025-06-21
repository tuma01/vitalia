import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getMunicipioColumns(translate: TranslateService): MtxGridColumn[] {
  return [
    {
      header: translate.stream('municipio.nombre'),
      field: 'nombre',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '300px',
    },
    {
      header: translate.stream('municipio.poblacion'),
      field: 'poblacion',
      minWidth: 100,
    },
    {
      header: translate.stream('municipio.codigoMunicipio'),
      field: 'codigoMunicipio',
      minWidth: 100,
    },
    {
      header: translate.stream('municipio.superficie'),
      field: 'superficie',
      minWidth: 120,
    },
    {
      header: translate.stream('municipio.provincia'),
      field: 'provincia.nombre',
      minWidth: 120,
    },
    {
      header: translate.stream('municipio.direccion'),
      field: 'provincia.direccion',
      minWidth: 120,
    }
  ];
}
