import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginActivate implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {
    if (AuthenticationService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    return true;
  }
}
