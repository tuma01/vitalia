import { CanActivate, Router } from "@angular/router";
import { TokenService } from "../token/token.service";
import { Injectable } from "@angular/core";
import { UserAuthService } from "../user-auth.service";
import { map, Observable, of, take, tap } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {

    // constructor(private tokenService: TokenService, private router: Router) {}

    // canActivate(): boolean {
    //   if (this.tokenService.isTokenValid()) {
    //     return true;
    //   } else {
    //     this.router.navigate(['login']);
    //     return false;
    //   }
    // }
    constructor(private tokenService: TokenService, private userAuthService: UserAuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    if (!this.tokenService.isTokenValid()) {
      this.userAuthService.logout().subscribe();
      return of(false);
    }

    return this.userAuthService.isAuthenticated().pipe(
      take(1),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
