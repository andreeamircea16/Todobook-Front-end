import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {LocalStorageService} from './local-storage.service';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})

export class RequestInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = request.headers;
    if (!headers.has('Content-Type')) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const authToken = LocalStorageService.getAuthToken();
    if (authToken) {
      headers = headers.set('Authorization', authToken.token || '');
    }

    const requestClone = request.clone({
      headers: headers
    });
    return next.handle(requestClone)
      .pipe(
        catchError(response => {
          if (response instanceof HttpErrorResponse) {
            if (response.status === 401) {
              return this.handleUnauthorized(requestClone, response);
            }
          }
          return throwError(response);
        })
      );
  }

  handleUnauthorized(interceptedRequest: HttpRequest<any>, interceptedResponse: HttpErrorResponse) {
    if (interceptedRequest.url === this.authenticationService.authUrl) {
      this.authenticationService.clearDataAndGoToLogin();
      return throwError(interceptedResponse);
    }

    return throwError(false);
  }
}
