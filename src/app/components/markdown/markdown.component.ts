import { Component, Renderer2 } from '@angular/core';
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
import { PreviewDialogComponent } from '../../views/dialogs/preview-dialog/preview-dialog.component';
import { NavigatorService } from '../../services/navigator';
import { ToolBarService } from '../../services/tool-bar-service';

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
    private renderer: Renderer2,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private navigator: NavigatorService,
    private toolbar: ToolBarService
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
    this.toolbar.hide();
  }

  public toMain() {
    this.toolbar.show();
    this.navigator.navigateToMain();
  }

  public post() {
    var content = new Content();
    content.by = 'nepoznati pisac';
    content.category = this.titleForm.value.category;
    content.postTitle = this.titleForm.value.title;
    content.image = this.titleForm.value.shortContentImageUrl;
    content.shortContent = this.titleForm.value.shortContent;
    content.htmlContent = this.htmlForm.value.htmlContent;
    console.log('created content: ', content);

    //TODO when successfurl exit and this.toolTab.isWriteing = true;
  }

  private getHtmlContent() {
    var content = new Content();
    content.by = 'nepoznati pisac';
    content.category = this.titleForm.value.category;
    content.postTitle = this.titleForm.value.title;
    content.image = this.titleForm.value.shortContentImageUrl;
    content.shortContent = this.titleForm.value.shortContent;
    content.htmlContent = this.htmlForm.value.htmlContent;
    return content;
  }

  print(content: any) {
    console.log(content);
  }

  public preview() {
    if (!this.titleForm.valid) {
      return; //TODO add some kind of message
    }

    this.dialog.open(PreviewDialogComponent, {
      width: 'auto',
      maxWidth: 'none',
      data: {
        object: this.getHtmlContent(),
      },
    });
  }
}
