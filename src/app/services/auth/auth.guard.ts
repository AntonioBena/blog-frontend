import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NavigatorService } from '../navigator';
import { TokenService } from './TokenService';

export const AuthGuard: CanActivateFn = () => {
  const navigator = inject(NavigatorService);
  const tokenService = inject(TokenService);
  const token = tokenService.token;
  if (token) {
    return true;
  } else {
    navigator.navigateToLogin();
    return false;
  }
};
