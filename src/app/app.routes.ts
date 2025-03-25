import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RoutesConstants } from './constants/routes-constants';
import { RegisterComponent } from './views/register/register.component';

export const routes: Routes = [
  { path: RoutesConstants.LOGIN_ROUTE, component: LoginComponent },
  { path: RoutesConstants.REGISTER_ROUTE, component: RegisterComponent },
  { path: '**', redirectTo: RoutesConstants.LOGIN_ROUTE }
];
