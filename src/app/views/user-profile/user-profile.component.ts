import { Component } from '@angular/core';
import { NavigatorService } from '../../services/navigator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { UserConstants } from '../../constants/user-menu-constants';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/backend/user-service';
import { catchError } from 'rxjs';
import { UserDto } from '../../models/user';
import { Role } from '../../models/role';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth/AuthService';
import { BlogPost } from '../../models/blog-post';
import { PostListComponent } from '../../components/post-list/post-list.component';
import { BlogPostService } from '../../services/backend/blog-post-service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Utils } from '../../services/utils/utils';

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
    PostListComponent,
    NgxChartsModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  userInfoGroup!: FormGroup;
  public UserConstants = UserConstants;
  userTabs = Object.values(UserConstants);
  selectedTab: UserConstants = UserConstants.USER_INFO;

  public posts: BlogPost[] = [];

  public userRole: string | null = null;
  public currentUser = new UserDto();
  public selectedRole = Role.READER;
  Role = Role;

  postData: any[] = [];
  view: [number, number] = [700, 400];

  onTabChange(index: number) {
    this.selectedTab = this.userTabs[index] as UserConstants;

    if (this.selectedTab === UserConstants.POSTS) {
      this.getMyPosts(0, 10);
    }
    if (this.selectedTab == UserConstants.STATS) {
      const currentYear = new Date().getFullYear();
      this.blogService.getPostsCountByYear(currentYear).subscribe((data) => {
        this.postData = this.utils.formatChartData(data);
      });
    }
  }

  constructor(
    private userService: UserService,
    private navigator: NavigatorService,
    private fb: FormBuilder,
    private authService: AuthService,
    private blogService: BlogPostService,
    private utils: Utils
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
    this.utils.buildSuccessLogInfo('submitted', this.userInfoGroup.value);

    let user = new UserDto();
    user.firstName = this.userInfoGroup.value.name;
    user.lastName = this.userInfoGroup.value.lastName;
    user.email = this.userInfoGroup.value.email;
    user.role = this.userInfoGroup.value.role.toUpperCase();

    if (this.userInfoGroup.valid) {
      this.updateCurrentUser(user);
    }
  }

  private updateCurrentUser(userDto: UserDto) {
    let oldRole = this.currentUser.role;
    this.userService
      .updateUser(userDto)
      .pipe(
        catchError((error) => {
          return this.utils.buildError('Can not update user!', error);
        })
      )
      .subscribe((response) => {
        this.updateInputs(response);
        this.utils.buildSuccessLogInfo('NEW ROLE', response.role.toUpperCase());
        if (oldRole.trim().toUpperCase() !==
                            response.role.trim().toUpperCase()) {
                              this.utils.buildSuccess('Successfully updated, Redirecting to login!', '');
          this.authService.logout();
          this.navigator.navigateToLogin();
        }
        this.utils.buildSuccess('Successfully updated Profile!', '');
      });
  }

  public getMyPosts(page: number, size: number) {
    console.log('getting all blog posts');
    this.blogService
      .getPostsByAuthor(page, size)
      .pipe(
        catchError((error) => {
          return this.utils.buildError(error, 'Can not get blog posts!');
        })
      )
      .subscribe((resp) => {
        this.utils.buildSuccessLogInfo('gettered blog posts', resp);
        this.posts = resp.content;
      });
  }

  private getCurrentUser() {
    this.userService
      .getUserDetails()
      .pipe(
        catchError((error) => {
          return this.utils.buildError(error, 'Error getting user!');
        })
      )
      .subscribe((response) => {
        this.updateInputs(response);
      });
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
          this.currentUser.role?.toUpperCase() === 'ROLE_READER'
            ? Role.READER
            : Role.WRITER,
      });
    }
  }
}
