import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import DOMPurify from 'isomorphic-dompurify';
import { HtmlSanitizationConstants } from '../../constants/html-sanitization-constants';

@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html: any): SafeResourceUrl {
    const sanitizedHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: HtmlSanitizationConstants.ALLOWED_TAGS,
      ALLOWED_ATTR: HtmlSanitizationConstants.ALLOWED_ATTR,
    });

    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
}
