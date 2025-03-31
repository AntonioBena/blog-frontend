import { Injectable } from '@angular/core';
import { GenericConstants } from '../constants/regex-constants';

@Injectable({
  providedIn: 'root',
})
export class HtmlProcessor {
  public processHtmlInput(htmlContent: any) {
    return this.processVideoAndImageTags(htmlContent);
  }

  private processVideoAndImageTags(htmlContent: string) {
    let cont1 = this.replaceImageTags(htmlContent);
    const matches = [...cont1.matchAll(GenericConstants.VIDEO_TAG_REGEX)];
    let videoId;

    matches.forEach((match) => {
      const videoUrl = match[1];
      videoId = this.extractVideoIdFromUrl(videoUrl);
    });

    let processedContent = cont1.replace(
      GenericConstants.VIDEO_TAG_REGEX,
      `<div class="video-container"><iframe frameborder="0" allowfullscreen
      src="https://www.youtube.com/embed/${videoId}">
      </iframe></div>`
    );
    return processedContent;
  }

  private extractVideoIdFromUrl(url: string): string {
    const videoIdMatch = url.match(GenericConstants.YOUTUBE_REGEX);
    return videoIdMatch ? videoIdMatch[1] : '';
  }

  private replaceImageTags(htmlContent: string) {
    return (htmlContent = htmlContent.replace(
      GenericConstants.IMAGE_TAG_REGEX,
      (_match: string, p1: string) => {
        if (p1.includes('class=')) {
          return `<img${p1} class="custom-img">`;
        } else {
          return `<img${p1} class="custom-img"/>`;
        }
      }
    ));
  }
}
