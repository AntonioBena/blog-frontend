import { Injectable } from '@angular/core';
import { RegistrationRequest } from '../../models/requests/RegistrationRequest';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationRequest } from '../../models/requests/AuthenticationRequest';
import { ApiConstants } from '../../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = ApiConstants.BASE_AUTH_ENDPOINT;

  constructor(private http: HttpClient) {}

  public register(registrationRequest: RegistrationRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl + ApiConstants.REGISTER_ENDPOINT}`, registrationRequest);
  }

  public login(authenticationRequest: AuthenticationRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl + ApiConstants.LOGIN_ENDPOINT}`, authenticationRequest);
  }

  public activateAccount(code: string): Observable<any> {
    let p = new HttpParams().set(ApiConstants.ACTIVATE_ACCOUNT_PARAM, code);
    return this.http.get<any>(`${this.baseUrl + ApiConstants.ACTIVATE_ACCOUNT_ENDPOINT}`, {
      params: p,
    });
  }
}
