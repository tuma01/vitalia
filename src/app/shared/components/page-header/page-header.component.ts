import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MenuService } from '@core';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  host: {
    class: 'matero-page-header',
  },
  encapsulation: ViewEncapsulation.None,
  imports: [BreadcrumbComponent, TranslateModule],
})
export class PageHeaderComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly menu = inject(MenuService);

  @Input() title = '';
  @Input() subtitle = '';
  @Input() nav: string[] = [];
  @Input({ transform: booleanAttribute }) hideBreadcrumb = false;

  ngOnInit() {
    const basePath = this.router.url.split('?')[0].slice(1);
    const routes = basePath.split('/').filter(segment => segment.trim() !== '');
    //const routes = this.router.url.slice(1).split('/');
    const menuLevel = this.menu.getLevel(routes);
    this.title = this.title || menuLevel[menuLevel.length - 1];
  }
}
