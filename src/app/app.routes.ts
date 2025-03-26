import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RoutesConstants } from './constants/routes-constants';
import { RegisterComponent } from './views/register/register.component';
import { MainComponent } from './views/main/main.component';
import { AcivateComponent } from '../app/views/acivate/acivate.component';
import { PostComponent } from './views/post/post.component';

export const routes: Routes = [
  { path: RoutesConstants.LOGIN_ROUTE, component: LoginComponent },
  { path: RoutesConstants.REGISTER_ROUTE, component: RegisterComponent },
  { path: RoutesConstants.ACTIVATE_ACC_ROUTE, component: AcivateComponent },
  { path: RoutesConstants.MAIN_ROUTE, component: MainComponent }, //TODO add auth guard
  { path: RoutesConstants.POST_DETAILS, component: PostComponent }, //TODO add auth guard
  { path: '**', redirectTo: RoutesConstants.LOGIN_ROUTE }
];
