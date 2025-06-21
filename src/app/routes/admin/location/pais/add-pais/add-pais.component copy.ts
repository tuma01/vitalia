import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PageHeaderComponent } from '@shared';
import { Country } from 'app/services/models/country';
import { CountryService } from 'app/services/services';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GetCountryById$Params } from 'app/services/fn/country/get-country-by-id';
import { CreateCountry$Params } from 'app/services/fn/country/create-country';
import { UpdateCountry$Params } from 'app/services/fn/country/update-country';

@Component({
  selector: 'app-add-pais',
  imports: [
    CommonModule,
    PageHeaderComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatOptionModule,
    MatSelectModule,
    ],
  templateUrl: './add-pais.component copy.html',
  styleUrl: './add-pais.component.scss'
})
export class AddPaisComponentCopy {

  private countryService = inject(CountryService);
  translate = inject(TranslateService);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  countryId: number | null = null;

  submitted = false;
  errorMessage = '';

  countryForm = this.fb.nonNullable.group({
    iso: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    iso3: ['', [Validators.minLength(3), Validators.maxLength(3)]],
    name: ['', [Validators.required]],
    niceName: ['', [Validators.required]],
    numCode: [0 , [Validators.pattern(/^[0-9]*$/)]], // Valida que solo sean números
    phoneCode: [0, [Validators.required, Validators.pattern(/^[0-9]*$/)]], // Valida que solo sean números
  });

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.countryForm.invalid) {
      this.countryForm.markAllAsTouched();
      this.showErrorMessage('validation.requiredFields');
      return;
    }

    const formData = this.countryForm.getRawValue();
    this.createCountry(formData);
  }

  private createCountry(countryData: Country): void {
    const params: CreateCountry$Params = { body: countryData };

    this.countryService.createCountry(params).subscribe({
      next: (response) => this.handleSuccess(response, 'country.addSuccess'),
      error: (error) => this.handleError(error, 'country.addError')
    });
  }

  private handleSuccess(response: Country, messageKey: string): void {
    this.snackBar.open(
      this.translate.instant(messageKey, { name: response.name }),
      'Cerrar',
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
    this.router.navigate(['admin/pais/paises']);
  }

  private handleError(error: HttpErrorResponse, messageKey: string): void {
    this.submitted = false;
    const errorDetail = error.error?.message || error.message || '';
    this.errorMessage = `${this.translate.instant(messageKey)}: ${errorDetail}`;

    this.snackBar.open(this.errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  private showErrorMessage(translationKey: string): void {
    this.snackBar.open(
      this.translate.instant(translationKey),
      'Cerrar',
      { duration: 3000 }
    );
  }

  getErrorMessage(controlName: keyof Country) {
    const control = this.countryForm.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }

    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    }

    if (control?.hasError('maxlength')) {
      return `Debe tener como máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    }

    if (control?.hasError('email')) {
      return 'No es un correo electrónico válido';
    }

    if (control?.hasError('pattern')) {
      return 'Formato no válido';
    }
    return '';
  }

  // onSubmit() {
  //   this.submitted = true;
  //   this.errorMessage = '';
  //   const SUCCESS_MSG = 'País agregado exitosamente';
  //   const ERROR_MSG = 'Error al agregar el país. Por favor, inténtalo de nuevo.';
  //   const VALIDATION_MSG = 'Por favor, completa todos los campos requeridos correctamente.';

  //   if (this.countryForm.valid) {
  //     const newCountry: Country = this.countryForm.getRawValue();
  //     this.countryService.createCountry({ body: newCountry }).subscribe({
  //       next: (response) => {
  //         this.snackBar.open(SUCCESS_MSG, 'Cerrar', { duration: 3000 });
  //         this.submitted = false;
  //         this.router.navigate(['admin/pais/paises']);
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         this.errorMessage = error.error?.message
  //           ? `Error al agregar el país: ${error.error.message}`
  //           : ERROR_MSG;

  //         this.snackBar.open(`Error: ${this.errorMessage}`, 'Cerrar', {
  //           duration: 5000,
  //           panelClass: ['error-snackbar'],
  //         });
  //         this.submitted = false;
  //       },
  //     });
  //   } else {
  //     this.countryForm.markAllAsTouched();
  //     this.snackBar.open(VALIDATION_MSG, 'Cerrar', { duration: 3000 });
  //   }
  // }

  // onSubmit() {
  //   this.submitted = true;
  //   this.errorMessage = '';

  //   if (this.countryForm.valid) {
  //     const newCountry: Country = this.countryForm.getRawValue();
  //     this.countryService.createCountry({ body: newCountry }).subscribe({
  //       next: (response) => {
  //         console.log('País agregado exitosamente', response);
  //         this.snackBar.open('País agregado exitosamente', 'Cerrar', {
  //           duration: 3000,
  //         });

  //         // this.countryForm.reset(); // Resetea el formulario después de un éxito
  //         this.submitted = false; // Resetea la bandera de envío
  //         this.router.navigate(['admin/pais/paises']);
  //       },
  //       error: (error: HttpErrorResponse) => {
  //         console.error('Error al agregar el país', error);
  //         this.errorMessage = 'Error al agregar el país. Por favor, inténtalo de nuevo.';
  //         if (error.error?.message) {
  //           this.errorMessage = `Error al agregar el país: ${error.error.message}`;
  //         }
  //         this.snackBar.open(`Error: ${this.errorMessage}`, 'Cerrar', {
  //           duration: 5000,
  //           panelClass: ['error-snackbar'], // Opcional: clase CSS para estilos de error
  //         });
  //         this.submitted = false; // Resetea la bandera de envío en caso de error
  //       },
  //     });
  //   } else {
  //     this.countryForm.markAllAsTouched();
  //     this.snackBar.open('Por favor, completa todos los campos requeridos correctamente.', 'Cerrar', {
  //       duration: 3000,
  //     });
  //   }
  // }

}
