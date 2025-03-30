import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './AuthService';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles: string[] = route.data['expectedRoles'];
    const userRole = this.authService.getUserRole();

    if (!userRole || !expectedRoles.includes(userRole)) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
