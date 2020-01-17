import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({providedIn: 'root'})

export class NetworkingService {
  userUrl = 'http://localhost:8080/api/user/';
  adminUrl = 'http://localhost:8080/admin/';
  baseUrl = 'http://localhost:8080/api/';

  constructor(private httpClient: HttpClient) {
  }

  getBooks() {
    return this.httpClient.get(`${this.baseUrl}book/`);
  }

  getBookById(id: string) {
    return this.httpClient.get(`${this.baseUrl}book/${id}/`);
  }

  getCommentById(id: string) {
    return this.httpClient.get(`${this.baseUrl}comment/${id}/`);
  }

  addBook(book) {
    return this.httpClient.post(`${this.adminUrl}book/`, book);
  }

  deleteBook(id: string) {
    return this.httpClient.delete(`${this.adminUrl}book/${id}`);
  }

  getCategories() {
    return this.httpClient.get(`${this.baseUrl}category/`);
  }

  postComment(data) {
    return this.httpClient.post(`${this.baseUrl}comment/`, data);
  }

}
