export class HtmlSanitizationConstants {

  static readonly ALLOWED_TAGS: string[] = [
    'iframe', 'p', 'strong', 'em', 'ul', 'li', 'a', 'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'pre', 'code', 'br', 'div'
  ];

  static readonly ALLOWED_ATTR: string[] = [
    'src', 'frameborder', 'allowfullscreen', 'width', 'height', 'alt', 'class', 'style', 'target'
  ];
}
