import { Component, Input, Output, EventEmitter, TemplateRef, AfterViewInit, ViewChild, ElementRef, NgZone, Injector } from '@angular/core';
import { CrudConfig } from './crud-config';


import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TableConfig } from './crud-config';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-crud-template',
  imports: [
      CommonModule,
      FormsModule,
      MatButtonModule,
      MatFormFieldModule,
      MtxGridModule,
      MatInputModule,
      MatOptionModule,
      MatSelectModule,
      MatCardModule,
      TranslateModule,
      MatCheckboxModule,
      MatIconModule,
      MatToolbarModule,
      MatTooltipModule
    ],
  templateUrl: './crud-template.component.html',
  styleUrls: ['./crud-template.component.scss']
})
export class CrudTemplateComponent<T> {

  @Input() data: T[] = [];
  @Input() filteredData: T[] = [];
  @Input() columns: MtxGridColumn[] = [];
  @Input() isLoading = false;
  @Input() config!: CrudConfig<T>;
  @Input() tableConfig!: TableConfig;
  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() search = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<HTMLInputElement>();
  @Output() selectChange = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<any>();
  // ¡NUEVA PROPIEDAD! Para recibir los TemplateRef
  @Input() cellTemplates: { [key: string]: TemplateRef<any> } = {};

  constructor() { }
}
