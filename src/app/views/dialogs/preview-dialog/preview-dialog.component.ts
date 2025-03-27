import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Content } from '../../../models/content';
import { GenericConstants } from '../../../constants/app-generic-constants';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltip } from '@angular/material/tooltip';
import { SafeHtmlPipe } from "../../../components/video/safe-html.pipe";
import { MatDialogActions } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-preview-dialog',
  imports: [
    MatDividerModule,
    SafeHtmlPipe,
    MatDialogActions,
    MatButtonModule
],
  templateUrl: './preview-dialog.component.html',
  styleUrl: './preview-dialog.component.css'
})
export class PreviewDialogComponent implements OnInit{
  sanitizedContent!: SafeHtml;
  @ViewChild('contentContainer', { read: ViewContainerRef })
  contentContainer!: ViewContainerRef;
  @ViewChild('contentRef', { static: true }) contentRef!: ElementRef;

  publishedAt: string = 'Content is in preview mode';
  by: string = ''; //TODO add getter for user
  postTitle: any = '';
  postContent: any = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialog,
    private sanitizer: DomSanitizer,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.postTitle = this.data.object.postTitle;
    this.by = this.data.object.by;
    this.postContent = this.data.object.htmlContent;
    console.log("content is passed to preview ", this.data.object);

  }

  closeDialog() {
    this.dialogRef.closeAll();
  }

  public isFullSize: boolean = false;

  public toggleFullSize() {
    this.isFullSize = !this.isFullSize;
  }

  ngAfterViewInit(): void {
    this.replaceVideoTags();
    this.changeDetectorRef.detectChanges();
  }


  private replaceImageTags() {
    this.postContent = this.postContent.replace(
      GenericConstants.IMAGE_TAG_REGEX,
      (_match: string, p1: string) => {
        if (p1.includes('class=')) {
          return `<img${p1} class="custom-img">`;
        } else {
          return `<img${p1} class="custom-img"/>`;
        }
      }
    );
  }

  private replaceVideoTags() {
    this.replaceImageTags();
    const matches = [
      ...this.postContent.matchAll(GenericConstants.VIDEO_TAG_REGEX),
    ];
    let videoId;

    matches.forEach((match) => {
      const videoUrl = match[1];
      videoId = this.extractVideoIdFromUrl(videoUrl);
    });

    this.postContent = this.postContent.replace(
      GenericConstants.VIDEO_TAG_REGEX,
      `<div class="video-container"><iframe frameborder="0" allowfullscreen
      src="https://www.youtube.com/embed/${videoId}">
      </iframe></div>`
    );
    console.log(this.postContent);
  }

  extractVideoIdFromUrl(url: string): string {
    const videoIdMatch = url.match(GenericConstants.YOUTUBE_REGEX);
    return videoIdMatch ? videoIdMatch[1] : '';
  }
}
