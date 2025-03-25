import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RoutesConstants } from './constants/routes-constants';

export const routes: Routes = [
  { path: RoutesConstants.LOGIN_ROUTE, component: LoginComponent },
  { path: '**', redirectTo: RoutesConstants.LOGIN_ROUTE }
];
