import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MarkdownContent } from '../../models/markdown-content';
import { PostCategory } from '../../constants/post-category';
import { NavigatorService } from '../../services/navigator';
import { BlogPostService } from '../../services/backend/blog-post-service';
import { catchError, throwError } from 'rxjs';
import { BlogPost } from '../../models/blog-post';
import { ToastrService } from '../../services/toastr.service';
import { ToastType } from '../../constants/toast-types';
import { StatusCodes } from '../../constants/http-status-codes';
import { HtmlSanitizer } from '../../services/sanitizer';
import { ApiConstants } from '../../constants/api-constants';
import { ActivatedRoute } from '@angular/router';
import { PostComponent } from '../post/post.component';
import { Utils } from '../../services/utils/utils';

@Component({
  selector: 'app-markdown',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularEditorModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  standalone: true,
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownComponent implements OnInit {
  titleForm!: FormGroup;

  postCategories = Object.values(PostCategory);

  htmlForm = new FormGroup({
    htmlContent: new FormControl('', Validators.required),
  });

  constructor(
    private utils: Utils,
    private route: ActivatedRoute,
    private sanitizer: HtmlSanitizer,
    private toastr: ToastrService,
    private blogService: BlogPostService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private navigator: NavigatorService,
    private cdRef: ChangeDetectorRef
  ) {
    this.titleForm = this.fb.group({
      title: ['', [Validators.required]],
      shortContent: ['', [Validators.required]],
      shortContentImageUrl: ['', [Validators.required]],
      category: ['', [Validators.required]],
    });
  }

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '5rem',
    placeholder: 'Enter your main content here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold'], ['insertImage']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  private givenPost!: BlogPost;
  public givenContent!: string;

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params['data']) {
        this.givenPost = JSON.parse(params['data']);

        let postCategory = this.capitalizeFirstLetter(this.givenPost.category);

        this.titleForm = this.fb.group({
          title: this.givenPost.title,
          shortContent: this.givenPost.shortContent,
          shortContentImageUrl: this.givenPost.shortContentImageUrl,
          category: this.getEnumValue(postCategory),
        });
      }
      if (params['content']) {
        this.givenContent = params['content'];

        this.htmlForm.setValue({
          htmlContent: this.givenContent,
        });

        this.cdRef.detectChanges();
      }
    });
  }

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private getEnumValue(category: string): PostCategory {
    const enumValue = PostCategory[category as keyof typeof PostCategory];
    return enumValue || (category as PostCategory);
  }

  public toMain() {
    this.navigator.navigateToMain();
  }

  public post() {
    console.log(this.titleForm)
    if (!this.titleForm.valid) {
      this.toastr.showToastTc(ToastType.ERROR, 'All the fialed are mandatory');
    }

    let blogPost = new BlogPost();
    blogPost.id = this.givenPost?.id;
    blogPost.postOwner = this.givenPost?.postOwner;
    blogPost.title = this.titleForm.value.title;
    blogPost.shortContent = this.titleForm.value.shortContent;
    let category = this.titleForm.value.category;
    blogPost.category = category.toUpperCase();
    blogPost.shortContentImageUrl = this.titleForm.value.shortContentImageUrl;

    var cleanHtml = this.sanitizer.sanitize(this.htmlForm.value.htmlContent);

    const file = new File([cleanHtml], `blogpost.html`, {
      type: ApiConstants.FILE_TYPE,
    });

    this.blogService
      .uploadAndPublishBlogPost(blogPost, file)
      .pipe(
        catchError((error) => {
          if (error.status === StatusCodes.BadRequest) {
            this.utils.buildError('Please check your inputs', '');
          }
          return this.utils.buildErrorThrow('Error creating blog post', error);
        })
      )
      .subscribe(() => {
        this.utils.buildSuccess('Blog post successfully posted!', '');
        this.navigator.navigateToMain();
      });
  }

  private getPreviewHtmlContent() {
    var content = new MarkdownContent();
    content.by = 'nepoznati pisac';
    content.category = this.titleForm.value.category;
    content.postTitle = this.titleForm.value.title;
    content.image = this.titleForm.value.shortContentImageUrl;
    content.shortContent = this.titleForm.value.shortContent;
    content.htmlContent = this.htmlForm.value.htmlContent;
    return content;
  }

  public preview() {
    if (!this.titleForm.valid) {
      this.utils.buildError('Please check your inputs', '');
      return;
    }

    const dialogRef = this.dialog.open(PostComponent, {
      width: '70%',
      maxWidth: '50vw',
      panelClass: 'custom-dialog-container',
      data: this.getPreviewHtmlContent(),
    });

    dialogRef.afterClosed().subscribe(() => {
      //do after preview
    });
  }
}
