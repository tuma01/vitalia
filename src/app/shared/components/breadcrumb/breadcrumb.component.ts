import { Component, Input, OnInit, Pipe, PipeTransform, ViewEncapsulation, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { MenuService } from '@core/bootstrap/menu.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, startWith } from 'rxjs';

// Interface para el ítem de breadcrumb con icono
// interface BreadcrumbItem {
//   icon: string;       // Nombre del icono de Material
//   text?: string;
//   displayText: string; // Texto para mostrar (ya traducido o estático)
//   path?: string;      // Ruta opcional
// }
type BreadcrumbItem =
  | string
  | {
      icon: string;
      path?: string;
      ariaLabel?: string;
    };

// Pipe personalizado para manejar ambos tipos
// @Pipe({ name: 'breadcrumbTranslate' })
// export class BreadcrumbTranslatePipe implements PipeTransform {
//   transform(value: string | BreadcrumbItem, translate: TranslateService): string {
//     return typeof value === 'string' ? translate.instant(value) : (value.text || '');
//   }
// }

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, TranslateModule],
})
export class BreadcrumbComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly menu = inject(MenuService);
   readonly translate = inject(TranslateService);


  @Input() nav: Array<string | BreadcrumbItem> = [];

  navItems: Array<string | BreadcrumbItem> = [];

  isIconItem(item: BreadcrumbItem): item is { icon: string; path?: string } {
    return typeof item !== 'string';
  }

  trackByNavItem(index: number, item: BreadcrumbItem) {
    return typeof item === 'string' ? item : item.icon;
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        startWith(this.router)
      )
      .subscribe(() => {
        this.genBreadcrumb();
      });
  }

  genBreadcrumb() {
    const basePath = this.router.url.split('?')[0].slice(1);
    const routes = basePath.split('/').filter(segment => segment.trim() !== '');

    if (this.nav.length > 0) {
      this.navItems = [...this.nav];
    } else {
      this.navItems = this.menu.getLevel(routes);
      this.navItems.unshift({
        icon: 'home',
        ariaLabel: this.translate.instant('home'),
        path: '/'
      });
    }
  }

  // getItemText(item: string | BreadcrumbItem): string {
  //   if (typeof item === 'string') {
  //     return this.translate.instant(item);
  //   }
  //   return item.displayText ? this.translate.instant(item.displayText) : item.text || '';
  // }

  // genBreadcrumb() {
  //   const routes = this.router.url.slice(1).split('/');
  //   if (this.nav.length > 0) {
  //     this.navItems = [...this.nav];
  //   } else {
  //     this.navItems = this.menu.getLevel(routes);
  //     this.navItems.unshift('home');
  //   }
  // }
}
