import { Injectable, inject } from '@angular/core';
// import { AuthService, User } from '@core/authentication';
import { NgxPermissionsService, NgxRolesService } from 'ngx-permissions';
import { of, switchMap, tap } from 'rxjs';
import { Menu, MenuService } from './menu.service';
import { UserAuthService } from '@core/authentication/user-auth.service';

@Injectable({
  providedIn: 'root',
})
export class StartupService {
  private readonly userAuthService = inject(UserAuthService);
  private readonly menuService = inject(MenuService);
  private readonly permissonsService = inject(NgxPermissionsService);
  private readonly rolesService = inject(NgxRolesService);

  /**
   * Load the application only after get the menu or other essential informations
   * such as permissions and roles.
   */
  load() {
    return new Promise<void>((resolve, reject) => {
      // Asumimos que authService.change() emite cuando el estado de autenticación cambia
      // y que userAuthService.isAuthenticated() refleja el estado actual.
      this.userAuthService.isAuthenticated()
        .pipe(
          switchMap(isAuthenticated => {
            if (isAuthenticated) {
              return this.userAuthService.menu(); // Carga el menú si el usuario está autenticado
            } else {
              return of([]); // Devuelve un observable vacío si no está autenticado
            }
          }),
          tap(menu => this.setMenu(menu))
        )
        .subscribe({
          next: () => resolve(),
          error: (error) => {
            console.error('Error during startup:', error);
            resolve(); // Resuelve la promesa para evitar que la app se quede bloqueada
          },
        });
    });
  }

  private setMenu(menu: Menu[]) {
    if (menu && menu.length > 0) {
      this.menuService.addNamespace(menu, 'menu');
      this.menuService.set(menu);
    } else {
      // Manejar el caso donde no se cargó el menú (por ejemplo, usuario no autenticado)
      this.menuService.set([]); // Establecer un menú vacío
    }
  }
}
