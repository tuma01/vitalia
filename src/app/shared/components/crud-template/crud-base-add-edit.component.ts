import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Injectable()
export abstract class CrudBaseAddEditComponent<T, CreateParams, UpdateParams, GetParams> {

  protected fb = inject(FormBuilder);
  protected snackBar = inject(MatSnackBar);
  protected router = inject(Router);
  protected translate = inject(TranslateService);
  protected activatedRoute = inject(ActivatedRoute); // Incluir por si se necesita en hijos (como Edit)

  protected entityId: number | null = null; // Ahora definida en la base, accesible por hijas y template

  // Propiedades comunes a Add y Edit
  submitted = false;
  errorMessage = '';

  // El formulario específico de la entidad debe ser implementado por la clase hija
  // Usamos `protected` para que las clases hijas puedan acceder a él
  protected abstract form: FormGroup;

  // Key de traducción para el nombre de la entidad (ej: 'entity.country')
  protected abstract entityNameKey: string;

  // Método abstracto para que la clase hija defina la ruta de navegación exitosa
  protected abstract getSuccessRoute(): any[];

  // Método abstracto para que la clase hija implemente la lógica de guardar (crear o actualizar)
  // Recibe los datos limpios del formulario
  protected abstract saveEntity(formData: T): Observable<T>;

  // Método abstracto para cargar datos en el modo edición
  // Solo necesario para el componente de edición, el componente de adición puede dejarlo vacío o no llamarlo
  protected abstract loadEntityData(id: any): void;


  // Lógica común para el manejo del submit
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      // Usamos una key de traducción genérica
      this.showErrorMessage('crud.validation.requiredFields');
      return;
    }

    const formData = this.form.getRawValue() as T;
    this.saveEntity(formData).subscribe({
      next: (response) => this.handleSuccess(response, 'crud.save_success'), // Usamos key genérica
      error: (error) => this.handleError(error, 'crud.save_error') // Usamos key genérica
    });
  }

  // Lógica común para manejar el éxito
  protected handleSuccess(response: T, messageKey: string): void {
    // Interpolamos el nombre de la entidad y, si está disponible, el nombre del ítem guardado
    const entityName = this.translate.instant(this.entityNameKey);
    const itemName = (response as any).name || this.translate.instant('crud.default_item_name'); // Asumimos una propiedad 'name' o usamos un valor por defecto

    this.snackBar.open(
      this.translate.instant(messageKey, { entity: entityName, name: itemName }),
      this.translate.instant('common.close'), // Key genérica para 'Cerrar'
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
    this.router.navigate(this.getSuccessRoute());
  }

  // Lógica común para manejar errores
  protected handleError(error: HttpErrorResponse, messageKey: string): void {
    this.submitted = false;
    console.error(`Error ${this.translate.instant(this.entityNameKey)}:`, error); // Loguear el error completo para debugging

    const errorDetail = error.error?.message || error.message || '';
    const baseErrorMessage = this.translate.instant(messageKey, { entity: this.translate.instant(this.entityNameKey) }); // Interpolamos el nombre de la entidad

    this.errorMessage = `${baseErrorMessage}${errorDetail ? ': ' + errorDetail : ''}`;
    this.snackBar.open(this.errorMessage, this.translate.instant('common.close'), {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  // Método para mostrar mensajes de error genéricos en el snackbar
  protected showErrorMessage(translationKey: string, params?: any): void {
    this.snackBar.open(
      this.translate.instant(translationKey, params),
      this.translate.instant('common.close'),
      { duration: 3000 }
    );
  }

  // Método común para obtener mensajes de error de validación del formulario
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return this.translate.instant('validation.required');
    }
    if (errors['minlength']) {
      return this.translate.instant('validation.minlength', { requiredLength: errors['minlength'].requiredLength });
    }
    if (errors['maxlength']) {
      return this.translate.instant('validation.maxlength', { requiredLength: errors['maxlength'].requiredLength });
    }
    if (errors['email']) {
      return this.translate.instant('validation.email');
    }
    if (errors['pattern']) {
       // Si el patrón es específico y necesitas un mensaje detallado, puedes añadir lógica aquí
       // o usar keys de traducción más específicas como validation.pattern.numeric
      return this.translate.instant('validation.pattern');
    }
    return '';
  }

   // Método auxiliar para obtener un control por su nombre, útil en el template
  getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

   // Método para limpiar el formulario
  resetForm(): void {
    this.form.reset();
  }
}
