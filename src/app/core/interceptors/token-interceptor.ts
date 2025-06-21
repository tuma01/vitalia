import { inject } from '@angular/core';
import { HttpRequest } from '@angular/common/http';
import { TokenService } from '@core/authentication/token/token.service';
import { HttpHandlerFn } from '@angular/common/http';


export function tokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const tokenService = inject(TokenService);
  const token = tokenService.token;

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
}
