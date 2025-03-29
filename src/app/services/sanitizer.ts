import { Injectable } from "@angular/core";
import { HtmlSanitizationConstants } from "../constants/html-sanitization-constants";
import DOMPurify from 'isomorphic-dompurify';

@Injectable({
  providedIn: 'root'
})
export class HtmlSanitizer{
  public sanitize(html: any) {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: HtmlSanitizationConstants.ALLOWED_TAGS,
      ALLOWED_ATTR: HtmlSanitizationConstants.ALLOWED_ATTR,
    });
  }
}
