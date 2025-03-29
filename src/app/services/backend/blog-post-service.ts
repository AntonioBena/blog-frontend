import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiConstants } from "../../constants/api-constants";
import { Observable } from "rxjs";
import { BlogPost } from "../../models/blog-post";
import { LikeRequest } from "../../models/requests/like-request";
import { Page } from "../../models/page";
import { PostCategory } from '../../constants/post-category';

@Injectable({
  providedIn: 'root'
})
export class BlogPostService {

  private apiUrl = ApiConstants.BASE_BLOG_POST_URL;

  constructor(private http: HttpClient) {}

  uploadAndPublishBlogPost(blogPost: BlogPost, htmlFile: File) {
    const formData = new FormData();
    formData.append('blogPost', new Blob(
      [JSON.stringify(blogPost)], { type: ApiConstants.APPLICATION_JSON }));
    formData.append('htmlContent', htmlFile);
    return this.http.post(`${this.apiUrl}`, formData);
  }

  getAllShortBlogPosts(page: number, size: number, category: PostCategory): Observable<Page<BlogPost>> {
    var c = category.toUpperCase();
    return this.http.get<Page<BlogPost>>(`${this.apiUrl}/all?page=${page}&size=${size}&category=${c}`);
  }

  getBlogPost(postId: number, userId: number): Observable<BlogPost> { //TODO this will increment view count, extended version of post
    return this.http.get<BlogPost>(`${this.apiUrl}/${postId}?userId=${userId}`);
  }

  likeUnlikePost(likeRequest: LikeRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/like`, likeRequest);
  }
}
