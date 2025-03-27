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

  public navigateToActivateAcc(email: string){
    return this.router.navigate(['/' + RoutesConstants.ACTIVATE_ACC_ROUTE, {'data': email}]);
  }

  public navigateToMain(){
    return this.router.navigate(['/' + RoutesConstants.MAIN_ROUTE]);
  }

  public navigateToEditor(){
    return this.router.navigate(['/' + RoutesConstants.MARKDOWN_EDITOR]);
  }
}
