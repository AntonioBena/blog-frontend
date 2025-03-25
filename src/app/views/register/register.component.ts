import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth/AuthService';
import { ToastrService } from '../../services/toastr.service';
import { RegistrationRequest } from '../../models/requests/RegistrationRequest';
import { catchError, throwError } from 'rxjs';
import { NavigatorService } from '../../services/navigator';
import { ToastType } from '../../constants/toast-types';
import { StatusCodes } from '../../constants/http-status-codes';
import { emailValidator } from '../../validation/email-validator';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navigator: NavigatorService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, emailValidator()]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      var auth = this.createRegisterRequest(this.registerForm);

      this.authService
        .register(auth)
        .pipe(
          catchError((error) => {
            if (error.status === StatusCodes.BadRequest) {
              this.toastr.showToastTc(
                ToastType.ERROR,
                'Please check your inputs'
              );
            } else if (error.status === StatusCodes.Unauthorized) {
              this.toastr.showToastTc(ToastType.ERROR, 'Can not create user!');
            }
            console.error('Register error:');
            return throwError(() => new Error('Register error ' + error));
          })
        )
        .subscribe((data) => {
          this.toastr.showToastTc(
            ToastType.SUCCESS,
            'Activation code is being sent to your email'
          );
          this.navigator.navigateToActivateAcc(auth.email);
        });
    }
  }

  private createRegisterRequest(form: FormGroup) {
    var auth = new RegistrationRequest();
    auth.firstName = form.value.firstName;
    auth.lastName = form.value.lastName;
    auth.email = form.value.email;
    auth.password = form.value.password;
    return auth;
  }

  onLoginLink() {
    this.navigator.navigateToLogin();
  }
}
