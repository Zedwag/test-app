import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Post } from "../shared/interfaces";
import { PostService } from "../shared/post.service";
import { Subscription } from "rxjs";

import { ModalService } from "../_modal"; //TODEL

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.css"]
})
export class TableComponent implements OnInit, OnDestroy {
  @ViewChild("input", { static: false }) inputRef: ElementRef;
  @ViewChild("min", { static: false }) minRef: ElementRef;
  @ViewChild("max", { static: false }) maxRef: ElementRef;
  subs: Subscription = new Subscription();
  posts: Post[];
  visiblePosts: Post[]; //posts left after filtering/searching
  sortBy = -1; //0 - by username, 1 - by city, 2 - by title, 3 - by comAmount
  reverse = false;

  postForModal: Post;//object for modal window

  constructor(private service: PostService, private modalService: ModalService) {}

  ngOnInit() {
    this.subs.add(
      this.service.getPosts().subscribe(posts => {
        this.posts = posts;
        posts.forEach(post => {
          post.visible = true;

          this.subs.add(
            this.service.getUserInfo(post.userId).subscribe(userInfo => {
              post.name = userInfo.name;
              post.username = userInfo.username;
              post.city = userInfo.address.city;
            })
          );

          this.subs.add(
            this.service.getComments(post.id).subscribe(comments => {
              post.comments = comments;
              post.commentsAmount = comments.length;
            })
          );
        });
        this.visiblePosts = this.posts;
        this.postForModal = this.visiblePosts[0]
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  setPostForModal(id: number) {
    this.postForModal = this.visiblePosts[id]
    console.log(this.postForModal)
  }

  sortByUsername() {
    if (this.sortBy === 0) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = false;
      this.sortBy = 0;
    }

    this.reverse
      ? this.visiblePosts.sort((a: any, b: any) =>
          a.username < b.username ? 1 : -1
        )
      : this.visiblePosts.sort((a: any, b: any) =>
          a.username > b.username ? 1 : -1
        );
  }

  sortByCity() {
    if (this.sortBy === 1) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = false;
      this.sortBy = 1;
    }

    this.reverse
      ? this.visiblePosts.sort((a: any, b: any) => (a.city < b.city ? 1 : -1))
      : this.visiblePosts.sort((a: any, b: any) => (a.city > b.city ? 1 : -1));
  }

  sortByTitle() {
    if (this.sortBy === 2) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = false;
      this.sortBy = 2;
    }

    this.reverse
      ? this.visiblePosts.sort((a: any, b: any) => (a.title < b.title ? 1 : -1))
      : this.visiblePosts.sort((a: any, b: any) =>
          a.title > b.title ? 1 : -1
        );
  }

  sortByCommentsAmount() {
    if (this.sortBy === 3) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = false;
      this.sortBy = 3;
    }

    this.reverse
      ? this.visiblePosts.sort((a: any, b: any) =>
          a.commentsAmount < b.commentsAmount ? 1 : -1
        )
      : this.visiblePosts.sort((a: any, b: any) =>
          a.commentsAmount > b.commentsAmount ? 1 : -1
        );
  }

  //sorting after filtering/searching
  sort() {
    switch (this.sortBy) {
      case 0:
        this.sortBy = -1;
        this.sortByUsername();
        break;
      case 1:
        this.sortBy = -1;
        this.sortByCity();
        break;
      case 2:
        this.sortBy = -1;
        this.sortByTitle();
        break;
      case 3:
        this.sortBy = -1;
        this.sortByCommentsAmount();
        break;
    }
  }

  makePostsList() {
    this.filterByTitleLength();
    if (this.inputRef.nativeElement.value) this.searchInPost();
    this.sort();
  }

  filterByTitleLength() {
    this.visiblePosts = [];
    this.posts.forEach(post => {
      if (
        post.title.length >= this.minRef.nativeElement.value &&
        post.title.length <= this.maxRef.nativeElement.value
      )
        this.visiblePosts.push(post);
    });
  }

  searchInPost() {
    this.visiblePosts = this.visiblePosts.filter(post => {
      return (
        post.title.includes(this.inputRef.nativeElement.value) ||
        post.body.includes(this.inputRef.nativeElement.value)
      );
    });
  }
}
