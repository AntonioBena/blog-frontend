import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiConstants } from '../../constants/api-constants';
import { StatusCodes } from '../../constants/http-status-codes';
import { NavigatorService } from '../navigator';
import { TokenService } from './TokenService';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem(ApiConstants.TOKEN);
  console.debug("token from local storage is= " + token);

  const navigator = inject(NavigatorService);
  const tokenService = inject(TokenService);

  if (!req.url.startsWith(`${ApiConstants.BASE_AUTH_ENDPOINT}`)) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenService.token}`
      }
    });

    return next(clonedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === StatusCodes.Unauthorized) {
          console.log("Unauthorized request, redirecting to login...");
          console.log("ERROR: ", error);
          tokenService.removeToken();
          navigator.navigateToLogin();
        }
        return throwError(() => error);
      })
    );
  }
  return next(req);
};
