import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Login page is the default
  // { path: 'register', component: RegisterComponent },
  // { path: 'activate', component: AcivateComponent },
  //{ path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' } // Redirect unknown routes to login
];
