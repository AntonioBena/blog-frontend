import { Injectable } from '@angular/core';
import { RegistrationRequest } from '../../models/requests/RegistrationRequest';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthenticationRequest } from '../../models/requests/AuthenticationRequest';
import { ApiConstants } from '../../constants/api-constants';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = ApiConstants.BASE_AUTH_ENDPOINT;
  private jwtHelper = new JwtHelperService();

  private authStateSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authState$ = this.authStateSubject.asObservable();

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

  public saveToken(token: string): void {
    localStorage.setItem(ApiConstants.TOKEN, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(ApiConstants.TOKEN);
  }

  public getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = this.jwtHelper.decodeToken(token);

    console.log("DECODED TOKEN: ", decodedToken);

    const roles = decodedToken?.ROLES || [];
    if (roles.length > 0) {
      return roles[0]?.authority || null;
    }

    return null;
  }

  public getAuthenticatedUserInfo(){
    const token = this.getToken();
    if (!token) return null;

    const decodedToken: any = this.jwtHelper.decodeToken(token);

    const user = decodedToken?.sub;
    if (user.length > 0) {
      return user;
    }
    return null;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  public setAuthState(isAuthenticated: boolean): void {
    this.authStateSubject.next(isAuthenticated);
  }

  public logout(): void {
    localStorage.removeItem(ApiConstants.TOKEN);
  }
}
