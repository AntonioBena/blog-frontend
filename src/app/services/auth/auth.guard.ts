import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ApiConstants } from '../../constants/api-constants';
import { NavigatorService } from '../navigator';

export const AuthGuard: CanActivateFn = () => {
  const navigator = inject(NavigatorService);
  const token = localStorage.getItem(ApiConstants.TOKEN);
  if (token) {
    return true;
  } else {
    navigator.navigateToLogin();
    return false;
  }
};
