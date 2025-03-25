import { Injectable } from "@angular/core";
import { ApiConstants } from '../../constants/api-constants';

@Injectable({
  providedIn: 'root'
})
export class TokenService{

  removeToken(){
    localStorage.removeItem(ApiConstants.TOKEN);
  }

  set token(token: string){
    localStorage.setItem(ApiConstants.TOKEN, token)
  }

  get token(){
    return localStorage.getItem(ApiConstants.TOKEN) as string;
  }
}
