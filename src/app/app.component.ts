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

  showToolbar = true; //TODO auth check logic
  isWriter = true; //TODO writer check logic

  showToast = false;
  toastrMsg = "";
  toastrType = "";
  toastrPosition = "";

  constructor(private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private tokenService: TokenService,
    private navigator: NavigatorService,
    private toolbar: ToolBarService) {
    if(tokenService.checkTokenExists()){
      this.showToolbar = true;
    }else{
      //this.showToolbar = false; TODO
    }
  }

  isWriteingNew = false;

  ngOnInit(): void {
    this.toolbar.isVisible$.subscribe(status => {
      this.isWriteingNew = status;
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

  toProfile(){
    this.navigator.navigateToUserProfile();
    this.toolbar.show();
  }

  toBlog(){
    this.navigator.navigateToMain();
    this.toolbar.show();
  }

  toEditor(){
    this.navigator.navigateToEditor();
  }

  closeToast() {
    this.showToast = false;
  }
}
