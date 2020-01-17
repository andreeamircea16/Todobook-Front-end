import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NetworkingService} from "../networking.service";
import {Book} from "../models.model";
import {getEntity, parseResponse} from "../utils";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  pressed_link: string;
  form: FormGroup;
  formEdit: FormGroup;
  bookAddedMessage: boolean = false;
  bookEditedMessage: boolean = false;
  requiredFields: boolean = false;
  books: Book[] = [];
  errorMessage: string = '';
  modify: boolean = false;
  bookToBeEdited: Book;
  isAdmin: boolean = false;

  constructor(private networkingService: NetworkingService, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.form = new FormGroup({
      book_name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      author_name: new FormControl('', Validators.required),
    });

    this.authenticationService.getAccountDetails$();
    this.authenticationService.currentUserSubject.subscribe(
      user => {
        this.isAdmin = user ? user.isAdmin : false;
      }
    );
  }

  onAddSubmit() {
    this.requiredFields = !(this.form.status === 'VALID');
    if (this.form.status === 'VALID') {
      const newBook = {
        name: this.form.value.book_name,
        description: this.form.value.description,
        author: {
          uid: this.form.value.author_name
        },
        isAvailableToLoan: "true"
      };
      console.log(newBook);
      this.networkingService.addBook(newBook).subscribe((response: any) => {
        console.log(response);
        this.bookAddedMessage = true;
        window.setTimeout(() => {
          this.bookAddedMessage = false;
        }, 4000);
      });
    }
  }

  onPutSubmit() {
    this.requiredFields = !(this.formEdit.status === 'VALID');
    if (this.formEdit.status === 'VALID') {
      const newBook = {
        name: this.formEdit.value.book_name_edit,
        description: this.formEdit.value.description_edit,
        author: {
          uid: this.formEdit.value.author_name_edit
        }
      };
      console.log(newBook);
      // this.networkingService.putBook(newBook).subscribe((response: any) => {
      //   console.log(response);
      this.bookEditedMessage = true;
      window.setTimeout(() => {
        this.bookEditedMessage = false;
      }, 4000);
      // });
    }
  }

  modifyBook(book: Book) {
    this.modify = true;
    this.bookToBeEdited = book;
    console.log(book)
    this.formEdit = new FormGroup({
      book_name_edit: new FormControl(book.name, Validators.required),
      description_edit: new FormControl(book.description, Validators.required),
      author_name_edit: new FormControl(book.author.name, Validators.required),
    });
  }

  deleteBook(bookId: string) {
    this.errorMessage = '';
    this.networkingService.deleteBook(bookId).subscribe((response: any) => {
      if (response.status === 'OK') {
        this.books.splice(this.books.findIndex(book => book.uid === bookId), 1);
      }
    },
      error => {
        this.errorMessage = error.error.errorMessages[0];
        window.setTimeout(() => {
          this.errorMessage = '';
        }, 4000);
    });
  }

  getLinkName(class_name){
    this.pressed_link = class_name;

    if (this.pressed_link === 'sterge' || this.pressed_link === 'modifica') {
      this.networkingService.getBooks().subscribe((response: any) => {
        const copyBooks = parseResponse(response.data);
        console.log(copyBooks);
        let index = 0;
        copyBooks.response.map(uid => {
          // const copyBook = getEntity('copyBooks.', copyBooks.response, copyBooks.mappings);
          this.books[index++] = new Book(copyBooks.mappings[uid]);
        });
        console.log(this.books);
      });
    }
  }

}
