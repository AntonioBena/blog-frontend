import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Renderer2, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { GenericConstants } from '../../constants/app-generic-constants';

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    MatTooltip,
    MatDividerModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements AfterViewInit {

  sanitizedContent!: SafeHtml;
  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  @ViewChild('contentRef', { static: true }) contentRef!: ElementRef;

  likes: number = 300;
  comments: number = 1;

  postTitle: string = "Spring Says Goodbye to @Autowired: <div>Here’s What to Use Instead</div>";

  private style: any = 'width: 100% !important;max-width: 600px !important;display: block !important;margin: 15px auto !important;box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1) !important;transition: transform 0.2s ease-in-out !important';

  postContent: any = `
  <p><strong>@Autowired</strong> has been a core part of Spring dependency injection for years. However, with the latest updates, developers are encouraged to use <code>constructor injection</code> instead.</p>


  <img src="https://blog.pwskills.com/wp-content/uploads/2024/04/Autowired-In-Spring-Boot.jpg" alt="Spring @Autowired">

    <h2>Why is Spring Moving Away from @Autowired?</h2>
    <ul>
        <li>Improves **testability**</li>
        <li>Avoids **reflection-based injection**</li>
        <li>Ensures **better immutability**</li>
    </ul>

    <h2>Recommended Approach</h2>
    <p>Instead of using <code>@Autowired</code>, you should prefer <strong>constructor-based injection</strong>:</p>

    <pre><code>
    @Service
    public class UserService {
        private final UserRepository userRepository;

        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
    }
    </code></pre>

    <h2>Video Explanation</h2>
    <iframe width="560" height="315" src="https://www.youtube.com/watch?v=ET39IFffr24" frameborder="0" allowfullscreen></iframe>

    <p>By using constructor injection, we ensure that dependencies are always available and properly initialized. This makes our code more robust and easier to maintain.</p>

    <p>Want to learn more? Check out the official <a href="https://spring.io/guides" target="_blank">Spring documentation</a>.</p>
  `;

  constructor(private sanitizer: DomSanitizer, private changeDetectorRef: ChangeDetectorRef) {
  }
  isFullSize: boolean = false;

  toggleFullSize() {
    this.isFullSize = !this.isFullSize;
  }

  ngAfterViewInit(): void {
   this.replaceImageTags();
   this.changeDetectorRef.detectChanges();
  }

  replaceImageTags() {
    this.postContent = this.postContent.replace(
      GenericConstants.IMAGE_TAG_REGEX, (_match: string, p1: string) => {
      if (p1.includes('class=')) {
     return `<img${p1} class="custom-img">`;
       } else {
        return `<img${p1} class="custom-img"/>`;
       }
    });

    console.log("modified content", this.postContent);
  }
}
