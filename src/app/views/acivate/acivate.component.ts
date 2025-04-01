import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/AuthService';
import { ToastrService } from '../../services/toastr.service';
import { catchError, throwError } from 'rxjs';
import { ToastType } from '../../constants/toast-types';
import { StatusCodes } from '../../constants/http-status-codes';
import { NavigatorService } from '../../services/navigator';
import { TokenService } from '../../services/auth/TokenService';
@Component({
  selector: 'app-acivate',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './acivate.component.html',
  styleUrl: './acivate.component.css',
})
export class AcivateComponent implements OnInit {
  email: string = '';
  otpForm: FormGroup;

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.navigator.navigateToMain();
    }else{
      this.tokenService.removeToken();
    }
  }

  constructor(
    private fb: FormBuilder,
    private navigator: NavigatorService,
    private authService: AuthService,
    private toastr: ToastrService,
    public route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    route.params.subscribe((params) => {
      this.email = params['data'];
    });
    this.otpForm = this.fb.group({
      zero: new FormControl('', [
        Validators.required,
        Validators.maxLength(1),
        Validators.pattern(/^.{1}$/),
      ]),
      first: ['', [Validators.required]],
      second: ['', [Validators.required]],
      third: ['', [Validators.required]],
      fourth: ['', [Validators.required]],
      fifth: ['', [Validators.required]],
    });
  }

  limitToOneChar(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 1) {
      input.value = input.value.charAt(0);
    }
  }
  moveFocus(event: Event, nextInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }
  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') || '';
    const chars = pasteData.split('').slice(0, 6);

    if (chars.length === 6) {
      this.otpForm.patchValue({
        zero: chars[0],
        first: chars[1],
        second: chars[2],
        third: chars[3],
        fourth: chars[4],
        fifth: chars[5],
      });
    }
  }

  onActivateAccount() {
    if (this.otpForm.valid) {
      var otpCode =
        this.otpForm.value.zero +
        this.otpForm.value.first +
        this.otpForm.value.second +
        this.otpForm.value.third +
        this.otpForm.value.fourth +
        this.otpForm.value.fifth;
      console.debug('otp: ' + otpCode);

      this.authService
        .activateAccount(otpCode)
        .pipe(
          catchError((error) => {
            if (error.status === StatusCodes.BadRequest) {
              this.toastr.showToastTc(
                ToastType.ERROR,
                'Please check your inputs'
              );
            }
            console.error('Register error:');
            return throwError(() => new Error('Activation error ' + error));
          })
        )
        .subscribe((data) => {
          this.toastr.showToastTc(
            ToastType.SUCCESS,
            'Acaunt is successfuly activated!'
          );
          this.navigator.navigateToLogin();
        });
    }
  }

  onLoginLink() {
    this.navigator.navigateToLogin();
  }
}
