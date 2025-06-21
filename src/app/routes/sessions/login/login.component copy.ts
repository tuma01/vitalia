// import { Component, inject, OnInit } from '@angular/core';
import { NgStyle } from '@angular/common';
// import { IconDirective } from '@coreui/icons-angular';
import { AuthenticationRequest, AuthenticationResponse } from '../../../services/models';
import { CommonModule } from '@angular/common';

import { AuthenticationService } from '../../../services/services';
import { TokenService } from '@core/authentication/token/token.service';


// import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterLink,
      MatButtonModule,
      MatCardModule,
      MatCheckboxModule,
      MatFormFieldModule,
      MatInputModule,
      MtxButtonModule,
      TranslateModule
    ]
})
export class LoginComponent implements OnInit {
onClosed($event: Event) {
throw new Error('Method not implemented.');
}

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);
  private readonly tokenService = inject(TokenService);

  isSubmitting = false;
  authRequest: AuthenticationRequest = { email: 'juan.amachi@gmail.com', password: 'bolivia' };

  loginForm = this.fb.nonNullable.group({
    email: [this.authRequest.email, [Validators.required]],
    password: [this.authRequest.password, [Validators.required]],
    rememberMe: [false],
  });
type: any;
elevation: any;
dismissible: any;

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  errorMsg: Array<string> = [];

  ngOnInit(): void {
    // Redirigir al dashboard si ya hay un token válido
    if (this.tokenService.isTokenValid()) {
      this.router.navigate(['dashboard']);
    }
  }

  login(): void {
    this.errorMsg = [];
    const authData: AuthenticationRequest = this.loginForm.getRawValue() as AuthenticationRequest;

    this.authService.authenticate({
      body: authData
    }).subscribe({
      next: (res: AuthenticationResponse):void => {
        console.log('Respuesta de autenticación:', res);
        // Asegúrate de que el token esté presente en la respuesta
        if (res.token) {
          this.tokenService.token = res.token; // Asignar el token al servicio
          this.router.navigate(['dashboard']);
        } else {
          console.error('El token no está presente en la respuesta');
          this.errorMsg.push('Error: No se recibió un token válido del servidor.');
        }
      },
      error: (err) => {
        console.log('Error de autenticación:', err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.businessErrorDescription || 'Error desconocido ');
        }
      }
    });
  }

  register():void {
    console.log('register');
    this.router.navigate(['register']);
  }



  logout() {
    alert('Saliendo...');
    this.tokenService.logout();  // Elimina el token
    this.router.navigate(['login']);  // Redirige a la página de inicio de sesión
  }
}

  // handleError(error: any) {
  //   convertBlobToJson(error).then((parsedError) => {
  //     this.processError(parsedError);
  //   });
  // }

  // processError(error: any) {
  //   if (error.validationErrors) {
  //     this.errorMsg = error.validationErrors;
  //   } else {
  //     this.errorMsg.push(error.error);
  //   }
  // }
