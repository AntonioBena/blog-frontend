import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiConstants } from "../../constants/api-constants";
import { Observable } from "rxjs";
import { BlogPost } from "../../models/blog-post";
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

  getPostsByAuthor(page: number, size: number){
    return this.http.get<Page<BlogPost>>(`${this.apiUrl}/all/author?page=${page}&size=${size}`);
  }

  getBlogPost(postId: number): Observable<BlogPost> {
    return this.http.get<BlogPost>(`${this.apiUrl}/${postId}`);
  }


  getBlogPostHtmlContent(id: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/${id}/getHtmlContent`, { responseType: 'text' });
  }

  likeUnlikePost(postId: number): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/like?id=${postId}`,{});
  }

  postComment(comment: string, postId: number): Observable<any> {
    const payload = { comment };
    return this.http.post<any>(`${this.apiUrl}/comment`, payload, {
      params: new HttpParams().set('id', postId.toString()),
    });
  }

  getPostsCountByYear(year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/analytics/count-by-year/${year}`);
  }
}
