import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getBaseColumns(translate: TranslateService): MtxGridColumn[] {
  return [
    {
      header: translate.stream('id'),
      field: 'id',
      sortable: true,
      minWidth: 100,
      width: '100px',
    }
  ];
}
