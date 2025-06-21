import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';

export function getDoctorProfessionSpecialityColumns(translate: TranslateService): MtxGridColumn[] {
  return [
    {
      header: translate.stream('doctorProfessionSpeciality.name'),
      field: 'name',
      sortable: true,
      disabled: true,
      minWidth: 100,
      width: '300px',
    },
    {
      header: translate.stream('doctorProfessionSpeciality.description'),
      field: 'description',
      minWidth: 200,
    },
  ];
}
