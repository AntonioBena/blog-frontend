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
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  userInfoGroup!: FormGroup;
  public UserConstants = UserConstants;
  userTabs = Object.values(UserConstants);
  selectedTab: UserConstants = UserConstants.USER_INFO;

  onTabChange(index: number) {
    this.selectedTab = this.userTabs[index] as UserConstants;
  }

  constructor(private navigator: NavigatorService, private fb: FormBuilder) {
    this.userInfoGroup = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit() {}
}
