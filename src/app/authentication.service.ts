import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpUrlEncodingCodec} from '@angular/common/http';
import {LocalStorageService} from './local-storage.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {AuthenticationJWTToken, User} from "./models.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  readonly authUrl = 'http://localhost:8080/auth/login';
  private readonly signUpUrl = 'http://localhost:8080/auth/signup/';
  private readonly deauthUrl = 'http://localhost:8080/auth/logout';
  private readonly accountUrl = 'http://localhost:8080/api/user/';

  currentUserSubject = new BehaviorSubject<User>(null);
  currentUserInProgress = false;

  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  private static saveAuthToken(response: HttpResponse<any>): void {
    const authToken = new AuthenticationJWTToken(
      response.body.data.token,
      response.body.data.user_email);
    LocalStorageService.saveAuthToken(authToken);
  }

  static isAuthenticated(): boolean {
    const authToken = LocalStorageService.getAuthToken();
    return !!(authToken && authToken.token);
  }

  login(username: string, password: string): Observable<any> {
    const params = JSON.stringify({'email': username, 'password': password});

    return this.authenticate(params);
  }

  authenticate(params: string): Observable<any> {
    return this.httpClient.post(this.authUrl, params, {
      headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
      observe: 'response'
    }).pipe(
      map(response => {
        // save token
        if (response.status === 200) {
          AuthenticationService.saveAuthToken(response);
        }
        // get current profile
        this.getAccountDetails$();
      })
    );
  }

  logout(): void {
    const authToken = LocalStorageService.getAuthToken();
    if (authToken && authToken.token) {
      const params = new HttpParams({encoder: new HttpUrlEncodingCodec()})
        .set('token', authToken.token);

      this.httpClient.post(this.deauthUrl, params, {
        headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
        observe: 'response'
      }).pipe(tap(response => {
        if (response.status === 200) {
          this.clearDataAndGoToLogin();
        }
      })).subscribe();
    } else {
      this.router.navigate(['/login']);
    }
  }

  clearDataAndGoToLogin() {
    LocalStorageService.removeAuthToken();
    this.router.navigate(['/login']);
  }

  getAccountDetails$(): Observable<User> {
    // If we don't have the profile yet and the request isn't in progress, request it from the server
    if (!this.currentUserSubject.value && !this.currentUserInProgress) {
      this.currentUserInProgress = true;
      this.httpClient.get(this.accountUrl, {
        headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
      }).subscribe((response: any) => {
          this.currentUserInProgress = false;
          this.currentUserSubject.next(new User(response.data));
        });
    }
    return this.currentUserSubject;
  }

  signUp(credentials: {email, password}) {
    return this.httpClient.post(this.signUpUrl, credentials);
  }
}

