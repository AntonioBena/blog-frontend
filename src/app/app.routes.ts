import { Routes } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { RoutesConstants } from './constants/routes-constants';
import { RegisterComponent } from './views/register/register.component';
import { MainComponent } from './views/main/main.component';
import { AcivateComponent } from '../app/views/acivate/acivate.component';
import { PostComponent } from './views/post/post.component';
import { MarkdownComponent } from './views/markdown/markdown.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { RoleGuard } from './services/auth/role-guard';
import { Role } from './models/role';

export const routes: Routes = [
  //  { path: 'reader-dashboard', component: ReaderDashboardComponent, canActivate: [RoleGuard], data: { expectedRole: 'READER' } },
  { path: RoutesConstants.LOGIN_ROUTE, component: LoginComponent },
  { path: RoutesConstants.REGISTER_ROUTE, component: RegisterComponent },
  { path: RoutesConstants.ACTIVATE_ACC_ROUTE, component: AcivateComponent },
  { path: RoutesConstants.MAIN_ROUTE, component: MainComponent }, //TODO add auth guard
  { path: RoutesConstants.POST_DETAILS + `/:id`, component: PostComponent }, //TODO add auth guard
  { path: RoutesConstants.MARKDOWN_EDITOR, component: MarkdownComponent,
    canActivate: [RoleGuard], data: { expectedRoles: ['WRITER', 'ADMIN'] } },
  { path: RoutesConstants.USER_PROFILE, component: UserProfileComponent }, //TODO add auth guard
  { path: '**', redirectTo: RoutesConstants.LOGIN_ROUTE }
];
