import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiConstants } from '../../constants/api-constants';
import { Observable } from 'rxjs';
import { UserDto } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = ApiConstants.USER_DETAILS_URL;

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}`);
  }

  updateUser(userdto: UserDto): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}`, userdto);
  }
}
