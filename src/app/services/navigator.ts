import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RoutesConstants } from '../constants/routes-constants';


@Injectable({
  providedIn: 'root',
})
export class NavigatorService{

  constructor(private router: Router) {}

  public navigateToLogin(){
    return this.router.navigate([RoutesConstants.LOGIN_ROUTE]);
  }

  public navigateToRegister(){
    return this.router.navigate(['/' + RoutesConstants.REGISTER_ROUTE]); //'/register'
  }

  public navigateToActivateAcc(){
    return this.router.navigate(['/' + RoutesConstants.ACTIVATE_ACC_ROUTE]);
  }

  public navigateToMain(){
    return this.router.navigate(['/' + RoutesConstants.MAIN_ROUTE]);
  }
}
