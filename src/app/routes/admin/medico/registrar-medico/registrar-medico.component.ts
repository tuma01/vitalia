import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';

@Component({
  selector: 'app-registrar-medico',
  imports: [PageHeaderComponent, TranslateModule],
  templateUrl: './registrar-medico.component.html',
  styleUrl: './registrar-medico.component.scss'
})
export class RegistrarMedicoComponent {

}
