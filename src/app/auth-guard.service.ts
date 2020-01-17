import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate() {
    return this.checkForAuthentication();
  }

  private checkForAuthentication() {
    if (AuthenticationService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']).then();
    return false;
  }
}
