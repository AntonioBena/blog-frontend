import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-markdown',
  imports: [
    CommonModule,
  ],
  templateUrl: './markdown.component.html',
  styleUrl: './markdown.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class MarkdownComponent implements OnInit{

  constructor(

  ) {
  }

  ngOnInit() {

    };

    markdownText =
      `### Markdown example
---
This is an **example** where we bind a variable to the \`markdown\` component that is also bind to the editor.
#### example.component.ts
\`\`\`javascript
function hello() {
  alert('Hello World');
}
\`\`\`
#### example.component.html
\`\`\`html
<textarea [(ngModel)]="markdown"></textarea>
<markdown [data]="markdown"></markdown>
\`\`\``;

}
