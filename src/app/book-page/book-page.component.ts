import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {NetworkingService} from "../networking.service";
import {Book, User, Comment} from "../models.model";
import {AuthenticationService} from "../authentication.service";
import {parseResponse} from "../utils";

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.scss']
})

export class BookPageComponent implements OnInit {

  bookId: string;
  book: Book;
  user: User;
  commentText: string;

  constructor(private activatedRoute: ActivatedRoute,
              private networkingService: NetworkingService,
              private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.bookId = params['id'];
    });
    this.getBookDetails(this.bookId);
  }

  getBookDetails(id) {
    this.networkingService.getBookById(id).subscribe((response: any) => {
      let data;
      this.book = new Book(response.data);
      if (response.data.comments) {
        data = parseResponse(response.data.comments);
        console.log(data);
        let index = 0;
        data.response.map(uid => {
          if (data.mappings[uid].hasOwnProperty('commentTime')) {
            this.book.comments[index] = new Comment(data.mappings[uid]);
          }
          index++;
        });
      }
    });
  }

  onTextAreaChange(event) {
    if (event) {
      this.commentText = event.target.value;
    }
  }

  addComment() {
    this.authenticationService.getAccountDetails$();
    this.authenticationService.currentUserSubject.subscribe(
      user => {
        this.user = user;
      }
    );

    const data = {
      user: {
        uid: this.user.uid
      },
      referencedBook: {
        uid: this.book.uid
      },
      commentText: this.commentText
    };

    this.networkingService.postComment(data).subscribe((response: any) => {
      console.log(response);
      this.book.comments.push(new Comment(response.data));
    });
  }
}
