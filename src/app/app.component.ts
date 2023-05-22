import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostService } from './services/post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('updateForm') updateForm: FormGroup;
  loadedPosts = [];
  showLoading = false;
  updateClick = false;
  error = null;
  errorSub: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit() {
    this.errorSub = this.postService.errorHandling.subscribe((error) => {
      this.error = error;
    });
    this.fetchPosts();
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post) {
    // Send http request
    this.postService.createAndPost(postData).subscribe((data) => {
      console.log(data);
      this.fetchPosts();
      this.postService.errorHandling.next(null);
    }, (error) => {
      this.postService.errorHandling.next(error);
    });
  }

  onFetchPosts() {
    // Send http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send http request
    this.showLoading = true;
    this.postService.deletePosts().subscribe((data) => {
      this.showLoading = false;
      this.loadedPosts = [];
      this.postService.errorHandling.next(null);
    }, (error) => {
      this.postService.errorHandling.next(error);
    });
  }

  private fetchPosts() {
    this.showLoading = true;
    this.postService.fetchPosts().subscribe((posts) => {
      this.showLoading = false;
      this.loadedPosts = posts;
      this.postService.errorHandling.next(null);
    }, (error) => {
      this.postService.errorHandling.next(error);
    });
  }

  togglePostUpdate(postData: Post) {
    this.updateClick = true;
    setTimeout(() => {
      this.updateForm.setValue({
        id: postData.id,
        title: postData.title,
        content: postData.content
      });
    }, 50);
  }

  onUpdatePost(postData: Post) {
    // Send http request
    this.postService.updatePost(postData).subscribe((data) => {
      console.log(data);
      this.updateClick = false;
      this.fetchPosts();
      this.postService.errorHandling.next(null);
    }, (error) => {
      this.postService.errorHandling.next(error);
    });
  }
}
