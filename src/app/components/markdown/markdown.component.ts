import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  AngularEditorConfig,
  AngularEditorModule,
} from '@kolkov/angular-editor';

@Component({
  selector: 'app-markdown',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularEditorModule,
    MatButtonModule
  ],
  standalone: true,
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownComponent implements OnInit {

  htmlForm = new FormGroup({
    htmlContent: new FormControl('', Validators.required)
  });

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [['bold']],
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

  constructor() {}

  ngOnInit() {}


  print(content: any){
    console.log(content);
  }

}
