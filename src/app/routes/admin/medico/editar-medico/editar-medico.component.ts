import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-editar-medico',
  imports: [PageHeaderComponent, TranslateModule],
  templateUrl: './editar-medico.component.html',
  styleUrl: './editar-medico.component.scss'
})
export class EditarMedicoComponent {

}
