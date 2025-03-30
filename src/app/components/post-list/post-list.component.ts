import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BlogPost } from '../../models/blog-post';
import { TruncatePipe } from '../../services/pipes/truncate.pipe';
import { NavigatorService } from '../../services/navigator';
import { BlogPostService } from '../../services/backend/blog-post-service';
import { ToastrService } from '../../services/toastr.service';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, MatTooltipModule, TruncatePipe],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent {
  @Input() posts: BlogPost[] = [];

  private selectedBlogPost!: any;

  constructor(
    private toastr: ToastrService,
    private blogService: BlogPostService,
    private navigator: NavigatorService
  ) {}

  ngOnInit(): void {}

  fetchPost(postId: number) {
    console.log("selected id: " + postId);
    this.navigator.navigateToSelectedBlogPost(postId);
  }
}
