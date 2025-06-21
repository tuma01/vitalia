import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-lista-medicos',
  imports: [PageHeaderComponent, TranslateModule],
  templateUrl: './lista-medicos.component.html',
  styleUrl: './lista-medicos.component.scss'
})
export class ListaMedicosComponent {

}
