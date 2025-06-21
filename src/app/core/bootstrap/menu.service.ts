import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UserAuthService } from '@core/authentication/user-auth.service';
import { BehaviorSubject, catchError, map, Observable, of, share, tap } from 'rxjs';

export interface MenuTag {
  color: string; // background color
  value: string;
}

export interface MenuPermissions {
  only?: string | string[];
  except?: string | string[];
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
  visible?: boolean; // Mantenemos boolean simple
  // visibility?: boolean | 'always' | 'authenticated' | 'never'; // Nuevo campo
}

export interface Menu {
  route: string;
  name: string;
  type: 'link' | 'sub' | 'extLink' | 'extTabLink';
  icon: string;
  label?: MenuTag;
  badge?: MenuTag;
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
  visible?: boolean; // Mantenemos boolean simple
  // visibility?: boolean | 'always' | 'authenticated' | 'never'; // Nuevo campo
}

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private readonly menu$ = new BehaviorSubject<Menu[]>([]);
  // readonly userAuthService = inject(UserAuthService); // Servicio de autenticación

  constructor(private http: HttpClient) {
    this.loadMenu();
  }

  /**
   * Carga el menú desde el archivo JSON.
   */
  loadMenu(): Observable<Menu[]> {
    return this.http.get<{ menu: Menu[] }>('assets/menus/admin-menu.json').pipe(
      map(data => data.menu),
      catchError(error => {
        console.error('Error al cargar el menú:', error);
        return of([]); // Devuelve un observable con un array vacío en caso de error
      }),
      tap(menu => this.menu$.next(menu)) // Opcional: Actualiza el BehaviorSubject aquí si es necesario que el servicio mantenga el estado del menú
    );
  }

  // loadMenu(): Observable<Menu[]> {
  //   return this.http.get<{ menu: Menu[] }>('assets/menus/admin-menu.json').pipe(
  //     map(data => this.filterMenu(data.menu)), // Aquí llamamos filterMenu
  //     catchError(error => {
  //       console.error('Error al cargar el menú:', error);
  //       return of([]);
  //     }),
  //     tap(menu => this.menu$.next(menu))
  //   );
  // }

  /** Get all the menu data. */
  getAll(): Observable<Menu[]> {
    return this.menu$.asObservable();
  }

  /** Observe the change of menu data. */
  change(): Observable<Menu[]> {
    return this.menu$.pipe(share());
  }

  /** Initialize the menu data. */
  set(menu: Menu[]): Observable<Menu[]> {
    this.menu$.next(menu);
    return this.menu$.asObservable();
  }

  /** Add one item to the menu data. */
  add(menu: Menu) {
    const tmpMenu = this.menu$.value;
    tmpMenu.push(menu);
    this.menu$.next(tmpMenu);
  }

  /** Reset the menu data. */
  reset() {
    this.menu$.next([]);
  }

  /** Delete empty values and rebuild route. */
  buildRoute(routeArr: string[]): string {
    let route = '';
    routeArr.forEach(item => {
      if (item && item.trim()) {
        route += '/' + item.replace(/^\/+|\/+$/g, '');
      }
    });
    return route;
  }

  /** Get the menu item name based on current route. */
  getItemName(routeArr: string[]): string {
    return this.getLevel(routeArr)[routeArr.length - 1];
  }

  // Whether is a leaf menu
  private isLeafItem(item: MenuChildrenItem): boolean {
    const cond0 = item.route === undefined;
    const cond1 = item.children === undefined;
    const cond2 = !cond1 && item.children?.length === 0;
    return cond0 || cond1 || cond2;
  }

  // Deep clone object could be jsonized
  private deepClone(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }

  // Whether two objects could be jsonized equal
  private isJsonObjEqual(obj0: any, obj1: any): boolean {
    return JSON.stringify(obj0) === JSON.stringify(obj1);
  }

  // Whether routeArr equals realRouteArr (after remove empty route element)
  private isRouteEqual(routeArr: string[], realRouteArr: string[]): boolean {
    realRouteArr = this.deepClone(realRouteArr);
    realRouteArr = realRouteArr.filter(r => r !== '');
    return this.isJsonObjEqual(routeArr, realRouteArr);
  }

  getLevel(routeArr: string[]): string[] {
    let tmpArr: any[] = [];
    this.menu$.value.forEach(item => {
      let unhandledLayer = [{ item, parentNamePathList: [], realRouteArr: [] }];
      while (unhandledLayer.length > 0) {
        let nextUnhandledLayer: any[] = [];
        for (const ele of unhandledLayer) {
          const eachItem = ele.item;
          const currentNamePathList = this.deepClone(ele.parentNamePathList).concat(eachItem.name);
          let currentRealRouteArr = this.deepClone(ele.realRouteArr);
          if (eachItem.route) {
            const routeSegments = eachItem.route.startsWith('/') ? eachItem.route.slice(1).split('/') : eachItem.route.split('/');
            currentRealRouteArr = currentRealRouteArr.concat(routeSegments);
          }

          if (this.isRouteEqual(routeArr, currentRealRouteArr)) {
            tmpArr = currentNamePathList;
            break;
          }
          if (!this.isLeafItem(eachItem)) {
            const wrappedChildren = eachItem.children?.map(child => ({
              item: child,
              parentNamePathList: currentNamePathList,
              realRouteArr: currentRealRouteArr, // Pasamos la ruta actual para que se extienda en el siguiente nivel
            }));
            nextUnhandledLayer = nextUnhandledLayer.concat(wrappedChildren);
          }
        }
        unhandledLayer = nextUnhandledLayer;
      }
    });
    return tmpArr;
  }

  /** Add namespace for translation. */
  addNamespace(menu: Menu[] | MenuChildrenItem[], namespace: string) {
    menu.forEach(menuItem => {
      // Construye el nombre namespaced
      const namespacedName = namespace === 'menu' ? `${namespace}.${menuItem.name}` : `${namespace}.${menuItem.name}`;

      // Asigna el nombre namespaced
      menuItem.name = namespacedName;

      if (menuItem.children && menuItem.children.length > 0) {
        this.addNamespace(menuItem.children, menuItem.name);
      }
    });
  }


  // private filterMenu(menu: Menu[]): Menu[] {
  //   return menu.filter(item => this.checkVisibility(item))
  //     .map(item => {
  //       if (item.children) {
  //         item.children = this.filterMenuChildren(item.children);
  //       }
  //       return item;
  //     });
  // }

  // private filterMenuChildren(children: MenuChildrenItem[]): MenuChildrenItem[] {
  //   return children.filter(item => this.checkVisibility(item))
  //     .map(item => {
  //       if (item.children) {
  //         item.children = this.filterMenuChildren(item.children);
  //       }
  //       return item;
  //     });
  // }

  // private checkVisibility(item: Menu | MenuChildrenItem): boolean {
  //   // Si no está definido, mostramos por defecto (comportamiento actual)
  //   if (item.visibility === undefined) return true;

  //   // Manejo de los diferentes valores
  //   switch (item.visibility) {
  //     case 'always':
  //       return true;
  //     case 'never':
  //       return false;
  //     case 'authenticated':
  //       // this.userAuthService.isAuthenticated().subscribe(isAuth => {
  //       //return this.userAuthService.isAuthenticated(); //.isAuthenticated();?
  //       return true;// Cambiado para usar el BehaviorSubject
  //     default:
  //       return Boolean(item.visibility); // Para valores booleanos directos
  //   }
  // }
}


