import { Component, OnInit } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { PostCategory } from '../../constants/post-category';
import { CommonModule } from '@angular/common';
import { BlogPostService } from '../../services/backend/blog-post-service';
import { catchError, throwError } from 'rxjs';
import { ToastrService } from '../../services/toastr.service';
import { ToastType } from '../../constants/toast-types';
import { BlogPost } from '../../models/blog-post';
import { StatusCodes } from '../../constants/http-status-codes';

@Component({
  selector: 'app-main',
  imports: [CommonModule, PostListComponent, MatButtonModule, MatTabsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  public posts: BlogPost[] = [];
  categories = Object.values(PostCategory);
  selectedCategory: PostCategory = PostCategory.TECHNOLOGY; //Default selected

  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private blogService: BlogPostService
  ) {}

  ngOnInit(): void {
    this.getAllPosts(0, 10, PostCategory.TECHNOLOGY);
  }

  async getAllPosts(page: number, size: number, category: PostCategory) {
    console.log('getting all blog posts');
    this.blogService
      .getAllShortBlogPosts(page, size, category)
      .pipe(
        catchError((error) => {
          if (error.status === StatusCodes.BadRequest || error.status === StatusCodes.InternalServerError) {
            this.toastr.showToastTc(ToastType.ERROR, 'Can not get blog posts');
          }
          return throwError(() => new Error('Can not get blog posts ' + error));
        })
      )
      .subscribe((resp) => {
        console.log('gettered blog posts ', resp);
        this.posts = resp.content;
      });
  }
}
