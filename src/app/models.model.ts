export class AuthenticationJWTToken {
  readonly token: string;
  readonly user_email: string;

  constructor(token: string, user_email: string) {
    this.token = token;
    this.user_email = user_email;
  }
}

export class User {
  uid;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  company: Company;
  isAdmin: boolean;
  comments: Comment[];
  loans: Book[];
  wishlistBooks: Book[];

  constructor(newObj?: any) {
    this.uid = newObj && newObj.uid ? newObj.uid : null;
    this.first_name = newObj && newObj.firstName ? newObj.firstName : null;
    this.last_name = newObj && newObj.lastName ? newObj.lastName : null;
    this.email = newObj && newObj.email ? newObj.email : null;
    this.phone_number = newObj && newObj.phoneNumber ? newObj.phoneNumber : null;
    this.company = newObj && newObj.company ? new Company(newObj.company) : new Company();
    this.isAdmin = newObj && newObj.isAdmin ? newObj.isAdmin : null;
    if (newObj && newObj.comments && Array.isArray(newObj.comments)) {
      this.comments = newObj.comments.map((el) => new Comment(el));
    }
    if (newObj && newObj.loans && Array.isArray(newObj.loans)) {
      this.loans = newObj.loans.map((el) => new Book(el));
    }
    if (newObj && newObj.wishlistBooks && Array.isArray(newObj.wishlistBooks)) {
      this.wishlistBooks = newObj.wishlistBooks.map((el) => new Book(el));
    }
  }
}

export class Company {
  uid: string;
  name: string;
  email: string;
  phone_number: string;

  constructor(newObj?: any) {
    this.uid = newObj && newObj.uid ? newObj.uid : null;
    this.name = newObj && newObj.name ? newObj.name : null;
    this.email = newObj && newObj.email ? newObj.email : null;
    this.phone_number = newObj && newObj.phoneNumber ? newObj.phoneNumber : null;
  }
}

export class Book {
  uid: string;
  name: string;
  description: string;
  imageName: string;
  isAvailableToLoan: boolean;
  author: Author;
  categories: Category[];
  comments: Comment[];

  constructor(newObj?: any) {
    this.uid = newObj && newObj.uid ? newObj.uid : null;
    this.name = newObj && newObj.name ? newObj.name : null;
    this.description = newObj && newObj.description ? newObj.description : null;
    this.imageName = newObj && newObj.imageName ? '../../assets/images/' + newObj.imageName : null;
    this.isAvailableToLoan = newObj && newObj.isAvailableToLoan ? newObj.isAvailableToLoan : true;
    this.author = newObj && newObj.author ? new Author(newObj.author) : new Author();
    if (newObj && newObj.categories && Array.isArray(newObj.categories)) {
      this.categories = newObj.categories.map((el) => new Category(el));
    }
    if (newObj && newObj.comments && Array.isArray(newObj.comments)) {
      this.comments = newObj.comments.map((el) => new Comment(el));
    }
  }
}

export class Category {
  uid: string;
  name: string;
  description: string;
  books: Book[];

  constructor(newObj?: any) {
    this.uid = newObj && newObj.uid ? newObj.uid : null;
    this.name = newObj && newObj.name ? newObj.name : null;
    this.description = newObj && newObj.description ? newObj.description : null;
    if (newObj && newObj.books && Array.isArray(newObj.books)) {
      this.books = newObj.books.map((el) => new Book(el));
    }
  }
}

export class Author {
  uid: string;
  name: string;
  trivia: string;
  books: Book[];

  constructor(newObj?: any) {
    this.uid = newObj && newObj.uid ? newObj.uid : null;
    this.name = newObj && newObj.name ? newObj.name : null;
    this.trivia = newObj && newObj.trivia ? newObj.trivia : null;
    if (newObj && newObj.books && Array.isArray(newObj.books)) {
      this.books = newObj.books.map((el) => new Book(el));
    }
  }
}

export class Comment {
  uid: string;
  user: User;
  book: Book;
  comment_time: Date;
  comment_text: string;
  
  constructor(newObj?: any) {
    this.uid = newObj && newObj.uid ? newObj.uid : null;
    this.user = newObj && newObj.user ? new User(newObj.user) : new User();
    this.book = newObj && newObj.book ? new Book(newObj.book) : new Book();
    this.comment_time = newObj && newObj.commentTime ? new Date(newObj.commentTime) : null;
    this.comment_text = newObj && newObj.commentText ? newObj.commentText : null;
  }
}
