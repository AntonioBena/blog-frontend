import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from './services/toastr.service';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatIconModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'blog';

  showToast = false;
  toastrMsg = "";
  toastrType = "";
  toastrPosition = "";

  constructor(private toastr: ToastrService) {
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
