import { MtxGridColumn } from '@ng-matero/extensions/grid';

export interface TableConfig {
    pageSize?: number;
    pageSizeOptions?: number[];
    showToolbar?: boolean;
    columnSortable?: boolean;
    columnResizable?: boolean;
    multiSelectable?: boolean;
    rowSelectable?: boolean;
    hideRowSelectionCheckbox?: boolean;
    rowHover?: boolean;
    rowStriped?: boolean;
    columnHideable?: boolean;
    columnPinnable?: boolean;
    expandable?: boolean;
    showPaginator?: boolean;
}

export interface CrudConfig<T> {
    columns: MtxGridColumn[];
    translations: {
        add: string;
        entityName: string;
        searchPlaceholder: string;
    };
    table?: TableConfig;
    service?: any;
}
