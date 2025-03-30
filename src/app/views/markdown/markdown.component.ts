import { Component } from '@angular/core';
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
import { Content } from '../../models/content';
import { PostCategory } from '../../constants/post-category';
import { PreviewDialogComponent } from '../dialogs/preview-dialog/preview-dialog.component';
import { NavigatorService } from '../../services/navigator';
import { BlogPostService } from '../../services/backend/blog-post-service';
import { catchError, throwError } from 'rxjs';
import { BlogPost } from '../../models/blog-post';
import { ToastrService } from '../../services/toastr.service';
import { ToastType } from '../../constants/toast-types';
import { StatusCodes } from '../../constants/http-status-codes';
import { HtmlProcessor } from '../../services/html-processor';
import { HtmlSanitizer } from '../../services/sanitizer';
import { ApiConstants } from '../../constants/api-constants';

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
    private sanitizer: HtmlSanitizer,
    private toastr: ToastrService,
    private blogService: BlogPostService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private navigator: NavigatorService
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

  ngOnInit() {
    //this.toolbar.hide();
  }

  public toMain() {
    this.navigator.navigateToMain();
  }

  public post() {
    if (!this.titleForm.valid) {
      this.toastr.showToastTc(ToastType.ERROR, 'All the fialed are mandatory');
    }

    let blogPost = new BlogPost();
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
          this.toastr.showToastTc(ToastType.ERROR,'Please check your inputs');
        }
        console.error('Error creating blog post');
        this.toastr.showToastTc(ToastType.ERROR,'Error creating blog post');
        return throwError(() => new Error('Error creating blog post ' + error));
      })
    )
    .subscribe(() => {
      this.toastr.showToastTc(
        ToastType.SUCCESS,
        'Blog post successfully posted!'
      );
      this.navigator.navigateToMain();
    });

  }

  private getPreviewHtmlContent() {
    var content = new Content();
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
      return; //TODO add some kind of message
    }

    this.dialog.open(PreviewDialogComponent, {
      width: '900px',
      maxHeight: '80vh',
      data: {
        object: this.getPreviewHtmlContent(),
      },
    });
  }
}
