import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { SafeHtml } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { SafeHtmlPipe } from '../../services/pipes/safe-html.pipe';
import { Content } from '../../models/content';
import { HtmlProcessor } from '../../services/html-processor';

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    MatTooltip,
    MatDividerModule,
    YouTubePlayerModule,
    SafeHtmlPipe,
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PostComponent implements OnInit {
  @Input() data: any;
  dialogData!: Content;
  public postContent: string = '';

  sanitizedContent!: SafeHtml;
  @ViewChild('contentContainer', { read: ViewContainerRef })
  contentContainer!: ViewContainerRef;
  @ViewChild('contentRef', { static: true }) contentRef!: ElementRef;

  likes: number = 0;
  comments: number = 0;
  publishedAt: string = '';
  by: string = ''; //TODO add getter for user
  postTitle: any = '';

  private unprocessedHtmlContent: string = ''; //from api

  constructor(
    private htmlProcessor: HtmlProcessor,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // this.likes = this.data.likes;
    // this.comments = this.data.comments;
    // this.publishedAt = this.data.publishedAt;
    // this.by = this.data.by;
    // this.postContent = this.data.htmlContent; //read from api
    // this.postTitle = this.data.postTitle;
    this.unprocessedHtmlContent = this.dummyContent();
  }

  public isFullSize: boolean = false;

  public toggleFullSize() {
    this.isFullSize = !this.isFullSize;
  }

  ngAfterViewInit(): void {
    this.postContent = this.htmlProcessor.processHtmlInput(
      this.unprocessedHtmlContent
    );
    this.changeDetectorRef.detectChanges();
  }

  public saveOrEditPost(postContent: string) {
    //TODO encode to byte array
  }

  private dummyContent() {
    return `
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
    <video src="https://www.youtube.com/watch?v=tX7t45m-4H8"/>

    <p>By using constructor injection, we ensure that dependencies are always available and properly initialized. This makes our code more robust and easier to maintain.</p>

    <p>Want to learn more? Check out the official <a href="https://spring.io/guides" target="_blank">Spring documentation</a>.</p>
  `;
  }
}
