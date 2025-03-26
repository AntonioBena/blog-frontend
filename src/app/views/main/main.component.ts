import { Component } from '@angular/core';
import { PostListComponent } from '../../components/post-list/post-list.component';

@Component({
  selector: 'app-main',
  imports: [
    PostListComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
