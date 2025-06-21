import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getDepartamentoHospitalColumns(translate: TranslateService): MtxGridColumn[] {
  return [
    {
      header: translate.stream('departamentoHospital.name'),
      field: 'name',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '300px',
    },
    {
      header: translate.stream('departamentoHospital.description'),
      field: 'description',
      minWidth: 200,
    },
  ];
}
