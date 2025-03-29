import { Component, Input } from '@angular/core';
import { Post } from '../../models/Post';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BlogPost } from '../../models/blog-post';
import { TruncatePipe } from "../../services/pipes/truncate.pipe";
import { NavigatorService } from '../../services/navigator';
import { BlogPostService } from '../../services/backend/blog-post-service';

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    MatTooltipModule,
    TruncatePipe
],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

  @Input() posts: BlogPost[] = [];

  constructor(
    private blogService: BlogPostService,
    private navigator: NavigatorService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
  }

  public onPostClick(post: BlogPost) {
    console.log('Clicked post:', post);
  }
}
