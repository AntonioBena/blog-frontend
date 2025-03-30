import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from '../../services/toastr.service';
import { catchError, throwError } from 'rxjs';
import { AuthenticationRequest } from '../../models/requests/AuthenticationRequest';
import { AuthService } from '../../services/auth/AuthService';
import { TokenService } from '../../services/auth/TokenService';
import { StatusCodes } from '../../constants/http-status-codes';
import { NavigatorService } from '../../services/navigator';
import { ToastType } from '../../constants/toast-types';
import { emailValidator } from '../../validation/email-validator';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.navigator.navigateToMain();
    }else{
      this.authService.setAuthState(false);
      this.tokenService.removeToken();
    }
  }

  constructor(
    private fb: FormBuilder,
    private navigator: NavigatorService,
    private toastr: ToastrService,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', [Validators.required]],
    });
  }

  onRegisterLink() {
    this.navigator.navigateToRegister();
  }

  onLogin() {
    if (this.loginForm.valid) {
      var auth = new AuthenticationRequest();
      auth.email = this.loginForm.value.email;
      auth.password = this.loginForm.value.password;

      this.authService
        .login(auth)
        .pipe(
          catchError((error) => {
            if (error.status === StatusCodes.BadRequest) {
              this.toastr.showToastTc(
                ToastType.ERROR,
                'Please check email and password'
              );
            } else if (error.status === StatusCodes.Unauthorized) {
              this.toastr.showToastTc(ToastType.ERROR, 'User can not Login!');
            }
            console.error('Login error:');
            return throwError(
              () => new Error('Login error ' + JSON.stringify(error))
            );
          })
        )
        .subscribe((data) => {
          this.toastr.showToastTc(ToastType.SUCCESS, 'Login succcessful');
          console.log('Login Successful:');
          this.tokenService.token = data.token as string;
          this.authService.setAuthState(true);
          this.navigator.navigateToMain();
        });
    }
  }
}
