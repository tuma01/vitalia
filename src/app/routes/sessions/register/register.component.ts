import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserRegisterDto } from 'app/services/models';
import { AuthenticationService } from 'app/services/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthenticationService);

  registerRequest: UserRegisterDto = {
    firstName: 'Juan',
    lastName: 'Amachi',
    email: 'juan.amachi@gmail.com',
    password: 'bolivia',
    personType: 'ADMIN'
  };

  registerForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]], // Agregué Validators.email
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
    personType: ['', [Validators.required]]// roles es un array, por lo que se inicia con un array vacio.
  }, { validators: this.matchValidator('password', 'confirmPassword') });

  constructor(public translate: TranslateService) {
    this.registerForm.setValue({
      firstName: this.registerRequest.firstName,
      lastName: this.registerRequest.lastName,
      email: this.registerRequest.email,
      password: this.registerRequest.password,
      confirmPassword: '',
      personType: this.registerRequest.personType
    });
  }
  errorMsg: Array<string> = [];

  register() {
    // this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    }).subscribe({
      next: (): void => {
        this.router.navigate(['activate-account']);
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  login() {
    this.router.navigate(['login']);
  }

  getTranslateParams() {
    const params = { value: this.translate.instant('validation.required') };
    console.log('translateParams JSON:', JSON.stringify(params));
    return params;
  }

  handleError(error: any) {
    try {
      const errorObj = typeof error.error === 'string' ? JSON.parse(error.error) : error.error;
      this.processError(errorObj);
    } catch (e) {
      this.errorMsg.push('Ocurrió un error al procesar la respuesta.');
    }
  }

  processError(errorObj: any) {
    console.error('Error capturado:', errorObj); // Para depuración
    let errorMessage = 'Ocurrió un error desconocido.';
    if (errorObj) {

      if (errorObj.businessErrorDescription) {
        const description = errorObj.businessErrorDescription;
        const match = description.match(/El valor (.*?) ya está en uso para el campo (.*)/);

        if (match) {
          // Formateamos el mensaje para el usuario
          errorMessage = `El valor "${match[1]}" ya está registrado en el campo "${match[2]}". Por favor, elige otro valor.`;
        } else {
          errorMessage = errorObj.businessErrorDescription;
        }
      }
      this.errorMsg.push(errorMessage);
    } else {
      this.errorMsg.push('Ocurrió un error desconocido. Inténtalo de nuevo.');
    }
  }

  matchValidator(source: string, target: string) {
    return (control: AbstractControl) => {
      const sourceControl = control.get(source)!;
      const targetControl = control.get(target)!;
      if (targetControl.errors && !targetControl.errors.mismatch) {
        return null;
      }
      if (sourceControl.value !== targetControl.value) {
        targetControl.setErrors({ mismatch: true });
        return { mismatch: true };
      } else {
        targetControl.setErrors(null);
        return null;
      }
    };
  }
}
