import { Component, OnInit } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../../models/Post';
import postsDataJson from '../../assets/posts.json';
import { PostCategory } from '../../constants/post-category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  imports: [
    CommonModule,
    PostListComponent,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {

  public posts: Post[] = [];
  categories = Object.values(PostCategory);
  selectedCategory: PostCategory = PostCategory.TECHNOLOGY; //Default selected

  constructor(private http: HttpClient){
  }

  ngOnInit(): void {
    this.fetchPostsByCategory(this.selectedCategory);
  }

  public fetchPostsByCategory(category: PostCategory) {
    this.selectedCategory = category;
    this.posts = postsDataJson; //TODO add logic for fetching posts by category
    console.log("Loaded posts:", this.posts);
    console.log("selected category: " + this.selectedCategory)
  }


}
