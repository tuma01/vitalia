import { inject, Injectable } from '@angular/core';
import { AuthenticationResponse, UserRegisterDto } from 'app/services/models';
import { TokenService } from './token/token.service';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // private readonly tokenService = inject(TokenService);
  private userSubject = new BehaviorSubject<UserRegisterDto | null>(this.getStoredUser());
  readonly user$ = this.userSubject.asObservable(); // Observable expuesto

  constructor(private tokenService: TokenService, private userService: UserService) {
    // Cargar usuario desde localStorage al iniciar
    // const storedUser = localStorage.getItem('user');
    // if (storedUser) {
    //   const parsedUser: UserRegisterDto = JSON.parse(storedUser);
    //   this.userSubject.next(parsedUser);
    // }
  }

  setSession(token: string, user: UserRegisterDto):void {
    this.tokenService.token = token;
    this.userService.setUser(user);

    // Convertir el avatar si es un array de bytes
    // this.processAvatar(user).then((processedUser) => {
    //   localStorage.setItem('user', JSON.stringify(processedUser));
    //   this.userSubject.next(processedUser);
    // });
  }

  clearSession(): void {
    this.tokenService.clearToken();
    this.userService.clearUser();
  }

  getToken(): string | null {
    return this.tokenService.token; // Obtener el token desde el servicio TokenService
  }

  private getStoredUser(): UserRegisterDto | null {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
    // TODO es mejor este return o el de arriba?
    //return JSON.parse(localStorage.getItem('user') || 'null');
  }
}
