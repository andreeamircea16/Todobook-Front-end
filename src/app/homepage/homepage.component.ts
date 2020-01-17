import {Component, OnInit} from '@angular/core';
import {NetworkingService} from "../networking.service";
import {Book} from "../models.model";
import {parseResponse} from "../utils";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  books = {'response': [], 'mappings': {}};
  firstRowBooks: Book[] = [];
  secondRowBooks: Book[] = [];

  constructor(private networkingService: NetworkingService) {
  }

  ngOnInit() {
    this.networkingService.getBooks().subscribe((response: any) => {
      this.books = parseResponse(response.data);
      let index = 0;
      this.books.response.map(uid => {
        if (index < 5) {
          this.secondRowBooks[index] = new Book(this.books.mappings[uid]);
        }
        if (index > 4 && index < 10) {
          this.firstRowBooks[index - 5] = new Book(this.books.mappings[uid]);
        }
        index++;
      });
    });
  }
}
