import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { SafeHtml } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { SafeHtmlPipe } from '../../services/pipes/safe-html.pipe';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { BlogPostService } from '../../services/backend/blog-post-service';
import { BlogPost } from '../../models/blog-post';
import { StatusCodes } from '../../constants/http-status-codes';
import { ToastType } from '../../constants/toast-types';
import { ToastrService } from '../../services/toastr.service';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth/AuthService';
import { NavigatorService } from '../../services/navigator';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MarkdownContent } from '../../models/markdown-content';
import { UserDto } from '../../models/user';
import { Utils } from '../../services/utils/utils';

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    MatTooltip,
    MatDividerModule,
    YouTubePlayerModule,
    SafeHtmlPipe,
    MatFormFieldModule,
    MatLabel,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit {
  private id!: number;
  public postContent: string = '';
  public selectedPost: any = [];

  public userRole: string | null = null;
  public isAuthenticated = false;
  public canEdit = false;

  commentForm: FormGroup;

  sanitizedContent!: SafeHtml;
  @ViewChild('contentContainer', { read: ViewContainerRef })
  contentContainer!: ViewContainerRef;
  @ViewChild('contentRef', { static: true }) contentRef!: ElementRef;
  @ViewChild('commentSection') commentSection!: ElementRef;

  constructor(
    private utils: Utils,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private blogService: BlogPostService,
    private changeDetectorRef: ChangeDetectorRef,
    public route: ActivatedRoute,
    private authService: AuthService,
    private navigator: NavigatorService,
    @Optional() public dialogRef?: MatDialogRef<PostComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public dialogData?: any
  ) {
    if (!this.dialogRef) {
      route.params.subscribe((params) => {
        this.id = params['id'];
      });
    }

    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.initPostComponent();
  }

  private async initPostComponent(){
    this.userRole = this.authService.getUserRole();
    if (!this.dialogRef) {
      this.fetchPost(this.id);
      await this.getPostHtmlContent(this.id);
    } else {
      this.postContent = this.dialogData?.htmlContent;
      this.selectedPost.title = this.dialogData?.postTitle;
    }
  }

  onLikeClicked() {
    console.log('Like button clicked!');
    this.blogService
      .likeUnlikePost(this.id)
      .pipe(
        catchError((error) => {
          return this.utils.buildError('Can not like at this moment, please try again later', error);
        })
      )
      .subscribe((resp) => {
        this.utils.buildSuccessLogInfo('Liked', resp);
        this.selectedPost.likeCount = resp;
      });
  }

  onCommentClicked() {
    this.commentSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  public addComment() {
    const commentText = this.commentForm.value.comment?.trim();
    if (!commentText) return;
    this.postComment(commentText, this.selectedPost.id);
  }

  private async postComment(comment: string, postId: number) {
    console.log('Posting comment...');

    this.blogService
      .postComment(comment, postId)
      .pipe(
        catchError((error) => {
          return this.utils.buildError('Cannot post comment', error);
        })
      )
      .subscribe((resp) => {
        this.commentForm.reset();
        this.selectedPost.comments = resp;
      });
  }

  private async fetchPost(postId: number) {
    try {
      this.selectedPost = await this.getPostById(postId);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  }

  private async getPostById(id: number): Promise<BlogPost | undefined> {
    console.log('getting blog post');
    try {
      const resp = await firstValueFrom(
        this.blogService.getBlogPost(id).pipe(
          catchError((error) => {
            if (error.status === StatusCodes.BadRequest) {
              return this.utils.buildError('Cant seem to find that blog post', error);
            }
            return this.utils.buildError('Cant seem to find blog post', error);
          })
        )
      );
      this.utils.buildSuccessLogInfo('Found blog post', resp);
      this.setCanEdit(resp);
      return resp;
    } catch (error) {
      throw this.utils.buildErrorThrow('Cant seem to find blog post', error);
    }
  }

  private setCanEdit(resp: BlogPost) {
    if (resp.postOwner.email === this.authService.getAuthenticatedUserInfo()) {
      this.canEdit = true;
    } else {
      this.canEdit = false;
    }
  }

  public deletePost() {
    console.log('delete');
  }

  public editPost() {
    this.navigator.navigateToEditor(this.selectedPost, this.postContent);
  }

  private async getPostHtmlContent(id: number) {
    console.log('getting blog post html content');

    try {
      const htmlContent = await firstValueFrom(
        this.blogService.getBlogPostHtmlContent(id).pipe(
          catchError((error) => {
            if (error.status === StatusCodes.InternalServerError) {
              this.toastr.showToastTc(
                ToastType.ERROR,
                'Error fetching content'
              );
            }
            throw this.utils.buildErrorThrow('Error fetching html content', error);
          })
        )
      );

      this.postContent = htmlContent;
    } catch (error) {
      console.error('Error fetching HTML content:', error);
    }
  }

  public isFullSize: boolean = false;

  public toggleFullSize() {
    this.isFullSize = !this.isFullSize;
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }

  public saveOrEditPost(postContent: string) {
    //TODO encode to byte array
  }
}
