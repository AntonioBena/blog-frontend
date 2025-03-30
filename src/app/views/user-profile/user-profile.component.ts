import { Component } from '@angular/core';
import { NavigatorService } from '../../services/navigator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { UserConstants } from '../../constants/user-constants';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/backend/user-service';
import { catchError, throwError } from 'rxjs';
import { ToastType } from '../../constants/toast-types';
import { ToastrService } from '../../services/toastr.service';
import { UserDto } from '../../models/user';
import { Role } from '../../models/role';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth/AuthService';

@Component({
  selector: 'app-user-profile',
  imports: [
    CommonModule,
    MatButtonModule,
    MatTabsModule,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  userInfoGroup!: FormGroup;
  public UserConstants = UserConstants;
  userTabs = Object.values(UserConstants);
  selectedTab: UserConstants = UserConstants.USER_INFO;

  public userRole: string | null = null;

  public currentUser = new UserDto();

  public selectedRole = Role.READER;
  Role = Role;

  onTabChange(index: number) {
    this.selectedTab = this.userTabs[index] as UserConstants;
  }

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private navigator: NavigatorService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.userRole = this.authService.getUserRole();
    this.getCurrentUser();
    this.userInfoGroup = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    console.log('submitted: ', this.userInfoGroup.value);

    let user = new UserDto();
    user.firstName = this.userInfoGroup.value.name;
    user.lastName = this.userInfoGroup.value.lastName;
    user.email = this.userInfoGroup.value.email;
    user.role = this.userInfoGroup.value.role;
    user.role = user.role.toUpperCase();

    if(this.userInfoGroup.valid){
      this.updateCurrentUser(user)
    }
  }

  private updateCurrentUser(userDto: UserDto) {
    let oldRole = this.currentUser.role;
    this.userService
      .updateUser(userDto)
      .pipe(
        catchError((error) => {
          return this.buildError(error, 'Cannot update user!');
        })
      )
      .subscribe((response) => {
        this.updateInputs(response);
        console.log("OLD ROLE " + oldRole.toUpperCase() + " NEW ROLE " + response.role.toUpperCase() )
        if (oldRole.trim().toUpperCase() !== response.role.trim().toUpperCase()) {
          this.toastr.showToastTc(ToastType.SUCCESS, 'Successfully updated, Redirecting to login!');
            this.authService.logout();
            this.navigator.navigateToLogin();
        }
        this.toastr.showToastTc(ToastType.SUCCESS, 'Successfully updated Profile!');
      });
  }

  private getCurrentUser() {
    this.userService
      .getUserDetails()
      .pipe(
        catchError((error) => {
          return this.buildError(error, 'Cannot get user details!');
        })
      )
      .subscribe((response) => {
        this.updateInputs(response);
      });
  }

  private buildError(error: any, message: string) {
    this.toastr.showToastTc(ToastType.ERROR, message);
    console.log(message);
    return throwError(() => new Error(message + ', ' + error));
  }

  private updateInputs(response: UserDto) {
    this.currentUser = response;
    console.log(response);
    if (this.currentUser) {
      this.selectedRole = response.role;
      this.userInfoGroup = this.fb.group({
        name: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        role:
          this.currentUser.role?.toUpperCase() === 'READER'
            ? Role.READER
            : Role.WRITER,
      });
    }
  }
}
