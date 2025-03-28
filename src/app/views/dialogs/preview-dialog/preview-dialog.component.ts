import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { SafeHtmlPipe } from '../../../services/safe-html.pipe';
import { MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HtmlProcessor } from '../../../services/html-processor';

@Component({
  selector: 'app-preview-dialog',
  imports: [MatDividerModule, SafeHtmlPipe, MatDialogActions, MatButtonModule],
  templateUrl: './preview-dialog.component.html',
  styleUrl: './preview-dialog.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PreviewDialogComponent implements OnInit {
  sanitizedContent!: SafeHtml;
  @ViewChild('contentContainer', { read: ViewContainerRef })
  contentContainer!: ViewContainerRef;
  @ViewChild('contentRef', { static: true }) contentRef!: ElementRef;

  publishedAt: string = 'Content is in preview mode';
  by: string = ''; //TODO add getter for user
  postTitle: any = '';
  private postContent: any = '';

  processedContent: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private htmlProcessor: HtmlProcessor,
    private dialogRef: MatDialog,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.postContent = this.data.object.htmlContent;
    this.postTitle = this.data.object.postTitle;
    this.by = this.data.object.by;
    this.processedContent = this.htmlProcessor.processHtmlInput(
      this.postContent
    );
    console.log('content is passed to preview ', this.data.object);
  }

  closeDialog() {
    this.dialogRef.closeAll();
  }

  public isFullSize: boolean = false;

  public toggleFullSize() {
    this.isFullSize = !this.isFullSize;
  }

  ngAfterViewInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}
