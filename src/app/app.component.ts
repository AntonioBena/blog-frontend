import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from './services/toastr.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import { TokenService } from './services/auth/TokenService';
import {MatTooltipModule} from '@angular/material/tooltip';

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

  constructor(private toastr: ToastrService, private tokenService: TokenService) {
    if(tokenService.checkTokenExists()){
      this.showToolbar = true;
    }else{
      //this.showToolbar = false;
    }
  }

  ngOnInit(): void {
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

  closeToast() {
    this.showToast = false;
  }
}
