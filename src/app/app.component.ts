import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from './services/toastr.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TokenService } from './services/auth/TokenService';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ToolBarService } from './services/tool-bar-service';
import { NavigatorService } from './services/navigator';
import { AuthService } from './services/auth/AuthService';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'blog';

  public userRole: string | null = null;
  public isAuthenticated = false;

  showToast = false;
  toastrMsg = "";
  toastrType = "";
  toastrPosition = "";

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private navigator: NavigatorService,
    private toolbar: ToolBarService) {
  }

  isWritingNew = false;


  ngOnInit(): void {
    this.authService.authState$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
      if (this.isAuthenticated) {
        this.userRole = this.authService.getUserRole();
      }
    });

    this.toolbar.isVisible$.subscribe(status => {
      this.isWritingNew = status;
      this.cdRef.detectChanges();
    });

    this.toastr.status.subscribe((msg: string) => {
      this.toastrType = localStorage.getItem("toastrType") || "";
      this.toastrPosition = localStorage.getItem("toastrPosition") || "";
      if (msg === null) {
        this.showToast = false;
      } else {
        this.showToast = true;
        this.toastrMsg = msg;
      }
    })
  }

  public logout(){
    this.authService.logout();
    this.navigator.navigateToLogin();
  }

  toProfile(){
    this.navigator.navigateToUserProfile();
  }

  toBlog(){
    this.navigator.navigateToMain();
  }

  toEditor(){
    this.navigator.navigateToEditor(null, null);
  }

  closeToast() {
    this.showToast = false;
  }
}
