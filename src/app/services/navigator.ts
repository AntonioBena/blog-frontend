import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RoutesConstants } from '../constants/routes-constants';
import { ToolBarService } from "./tool-bar-service";
import { TokenService } from './auth/TokenService';


@Injectable({
  providedIn: 'root',
})
export class NavigatorService{

  constructor(private router: Router, private toolbar: ToolBarService) {}

  public navigateToLogin(){
    return this.router.navigate([RoutesConstants.LOGIN_ROUTE]);
  }

  public navigateToRegister(){
    return this.router.navigate(['/' + RoutesConstants.REGISTER_ROUTE]);
  }

  public navigateToActivateAcc(email: string){
    return this.router.navigate(['/' + RoutesConstants.ACTIVATE_ACC_ROUTE, {'data': email}]);
  }

  public navigateToSelectedBlogPost(postId: number){
    return this.router.navigate(['/' + RoutesConstants.POST_DETAILS,  postId]);
  }

  public navigateToMain(){
    this.toolbar.show();
    return this.router.navigate(['/' + RoutesConstants.MAIN_ROUTE]);
  }

  public navigateToEditor(){
    this.toolbar.hide();
    return this.router.navigate(['/' + RoutesConstants.MARKDOWN_EDITOR]);
  }

  public navigateToUserProfile(){
    this.toolbar.show();
    return this.router.navigate(['/' + RoutesConstants.USER_PROFILE]);
  }
}
