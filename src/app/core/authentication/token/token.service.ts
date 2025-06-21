import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly tokenKey = 'vitalia-token';
  private isBrowser: boolean;

  constructor(//private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    // console.log('JwtHelperService está disponible:', !!this.jwtHelper);
  }

  // constructor(private jwtHelper: JwtHelperService) { }

  set token(token: string) {
    if (this.isBrowser && token) {
      localStorage.setItem(this.tokenKey, token);
    } else {
      this.clearToken();
    }
  }

  get token(): string | null {
    return this.isBrowser ? localStorage.getItem(this.tokenKey) : null;
  }

  // Verificar si el token es válido
  // isTokenValid(): boolean {
  //   const token = this.token;
  //   if (!token) {
  //     console.warn('No hay token disponible');
  //     return false;
  //   }

  //   try {
  //     const jwtHelper = new JwtHelperService();
  //     // Verificar directamente si el token ha expirado
  //     const isExpired = jwtHelper.isTokenExpired(token);
  //     if (isExpired) {
  //       console.warn('El token ha expirado');
  //       this.clearToken();
  //       return false;
  //     }
  //     return true;
  //   } catch (error) {
  //     console.error('Error al validar el token:', error);
  //     return false;
  //   }
  // }
  isTokenValid(): boolean {
    if (!this.token) return false;
    try {
      return !new JwtHelperService().isTokenExpired(this.token);
    } catch {
      return false;
    }
  }

  isTokenNotValid(): boolean {
    return !this.isTokenValid();
  }

  get userRoles(): string[] {
    const token = this.token;
    if (this.isBrowser && token) {
      try {
        const jwtHelper = new JwtHelperService();
        const decodedToken = jwtHelper.decodeToken(token);
        return decodedToken?.authorities || []; // Handle potential undefined values
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return [];
      }
    }
    return [];
  }

  // Limpiar el token del localStorage
  clearToken() {
    if (this.isBrowser) { // Usar la variable isBrowser
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Método para cerrar sesión
  // logout() {
  //   this.clearToken();
  //   console.log('Sesión cerrada.');
  // }
}
