import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of, switchMap, share, throwError, EMPTY, iif } from 'rxjs';
// import { AuthenticationRequest, AuthenticationResponse } from './models';
// import { TokenService } from './token.service';
// import { AuthenticationService, Authenticate$Params } from './api/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
import { TokenService } from './token/token.service';
import { environment } from '@env/environment';
import { AuthenticationService } from 'app/services/services';
import { User } from './interface';
import { Authenticate$Params } from 'app/services/fn/authentication/authenticate';
import { AuthenticationRequest, AuthenticationResponse } from 'app/services/models';
import { SessionService } from './session.service';
import { UserService } from './user.service';
import { MenuService } from '@core/bootstrap';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  // private user$ = new BehaviorSubject<User | null>(null);
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authenticationService: AuthenticationService,
    private tokenService: TokenService,
    private router: Router,
    private sessionService: SessionService,
    private userService: UserService,
    private menuService: MenuService
  ) {
    this.checkAuthentication();
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  login(authData: AuthenticationRequest): Observable<void> {
    const params: Authenticate$Params = { body: authData };

    return this.authenticationService.authenticate(params).pipe(
      tap((res: AuthenticationResponse) => {
        // Validar que la respuesta contiene el token y el usuario
        if (!res.token || !res.userRegister) {
          console.error('La respuesta de autenticación es inválida');
          throw new Error('Token o datos del usuario faltantes en la respuesta');
        }

        // Guardar la sesión y actualizar el estado
        this.sessionService.setSession(res.token, res.userRegister);
        this.userService.setUser(res.userRegister);
        this.isAuthenticated$.next(true);
      }),
      catchError((err) => {
        console.error('Error durante la autenticación:', err);
        return throwError(() => new Error('Error de autenticación')); // Manejar el error devolviendo un observable vacío
      }),
      switchMap(() => EMPTY)// Asegurar que el observable devuelva void
    );
  }

  logout(): Observable<void>  {
    this.sessionService.clearSession();
    this.userService.clearUser();
    this.isAuthenticated$.next(false);
    return of(undefined).pipe(tap(() => this.router.navigate(['login'])));
  }

  private checkAuthentication(): void {
    const user = this.userService.getUserSnapshot();
    if (this.tokenService.token && user) {
      this.isAuthenticated$.next(true);
    } else {
      this.isAuthenticated$.next(false);
    }
  }

  menu() {
    return iif(
      () => this.isAuthenticated$.getValue(),
      this.menuService.loadMenu(),
      of([]));
  }
}
