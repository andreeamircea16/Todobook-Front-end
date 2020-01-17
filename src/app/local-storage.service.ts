import {Injectable} from '@angular/core';
import {AuthenticationJWTToken} from "./models.model";

const tokenKey = 'token';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  static saveAuthToken(token: AuthenticationJWTToken) {
    localStorage.setItem(tokenKey, JSON.stringify(token));
  }

  static getAuthToken(): AuthenticationJWTToken | null {
    return JSON.parse(localStorage.getItem(tokenKey));
  }

  static removeAuthToken() {
    localStorage.removeItem(tokenKey);
  }
}
