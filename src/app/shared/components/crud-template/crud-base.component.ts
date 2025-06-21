import { OnInit, Directive, inject } from '@angular/core';
import { MtxGridColumn } from '@ng-matero/extensions/grid';
import { TranslateService } from '@ngx-translate/core';
import { CrudConfig, TableConfig } from './crud-config';

@Directive()
export abstract class CrudBaseComponent<T> implements OnInit {
    dataList: T[] = [];
    filteredData: T[] = [];
    isLoading = true;
    columns: MtxGridColumn[] = [];
    // placeholderValue = '';
    tableConfig: TableConfig;

    protected translate = inject(TranslateService);
    protected defaultTableConfig: TableConfig = {
        pageSize: 10,
        pageSizeOptions: [5, 10, 50, 100],
        showToolbar: true,
        columnSortable: true,
        rowSelectable: true,
        showPaginator: true,
        multiSelectable: true,
        hideRowSelectionCheckbox: false,
        columnHideable: true,
        columnPinnable: true,
        rowHover: true,
        rowStriped: true,
        expandable: false,
        columnResizable: false
    };

    constructor(protected config: CrudConfig<T>) {
        this.columns = this.config.columns;
        this.tableConfig = { ...this.defaultTableConfig, ...this.config.table };
    }

    ngOnInit(): void {
        this.loadData();
        // this.placeholderValue = 'Ex. ' + this.config.translations.searchPlaceholder;
    }

    abstract loadData(): void;
    abstract createNew(): void;
    abstract edit(record: T): void;
    abstract delete(record: T): void;

    onSearch(searchTerm: string): void {
        if (!searchTerm?.trim()) {
            this.filteredData = [...this.dataList];
            return;
        }

        const term = searchTerm.toLowerCase().trim();
        this.filteredData = this.dataList.filter(item => this.searchInObject(item, term));
    }

    protected searchInObject(obj: any, term: string): boolean {
        return Object.keys(obj).some(key => {
            const value = obj[key];

            if (key.startsWith('$')) return false;
            if (value == null) return false;

            if (typeof value === 'object' && !Array.isArray(value)) {
                return this.searchInObject(value, term);
            }

            if (Array.isArray(value)) {
                return value.some(arrayItem => {
                    if (typeof arrayItem === 'object' && arrayItem !== null) {
                        return this.searchInObject(arrayItem, term);
                    }
                    return String(arrayItem).toLowerCase().includes(term);
                });
            }

            return String(value).toLowerCase().includes(term);
        });
    }

    clearSearch(input: HTMLInputElement): void {
        input.value = '';
        this.filteredData = [...this.dataList];
    }

    changeSelect(e: any) {
        console.log(e);
    }

    changeSort(e: any) {
        console.log(e);
    }
}
