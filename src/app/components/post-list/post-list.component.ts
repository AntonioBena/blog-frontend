import { Component, Input } from '@angular/core';
import { Post } from '../../models/Post';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-post-list',
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css'
})
export class PostListComponent {

  @Input() posts: Post[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  }

  public onPostClick(post: Post) {
    console.log('Clicked post:', post);
    //TODO implement on click logic. Post should be opened.
    // Post should be in expanded maner, all text, links, images, videos should be visible
    // each post may have many images, many videos
  }
}
