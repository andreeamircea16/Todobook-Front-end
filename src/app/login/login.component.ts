import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AuthenticationService} from "../authentication.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  errors = {requiredUsername: false, requiredPassword: false, invalidPassword: false, invalidCredentials: false};
  errorMessage = '';
  successfulLogin = false;
  signUpMessage = '';
  signedUp = false;

  private tokenRequestSubscription: Subscription;

  constructor(private router: Router, private authenticationService: AuthenticationService) {}

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('admin@email.com', Validators.required),
      password: new FormControl('123abc',
        [Validators.required])
    });
  }

  private handleErrors() {
    this.errorMessage = null;
    this.errors.invalidPassword = false;

    this.errors.requiredUsername = !this.form.value.email;
    this.errors.requiredPassword = !this.form.value.password;
    if (!this.form.value.password) {
      return;
    }

    if (this.form.controls.password.status === 'INVALID') {
      this.errorMessage = 'Password should have at least 8 characters';
      this.errors.invalidPassword = true;
    }
  }

  onSubmit() {
    this.handleErrors();
    this.signUpMessage = '';

    if (this.form.status === 'VALID') {
      this.errors.invalidCredentials = false;

      if (this.tokenRequestSubscription) {
        // cancel previous token request
        this.tokenRequestSubscription.unsubscribe();
      }

      this.tokenRequestSubscription = this.authenticationService.login(this.form.value.email, this.form.value.password).subscribe(
        () => {
          this.errors.invalidCredentials = false;
          this.successfulLogin = true;
          window.setTimeout(() => {
            this.router.navigate(['/'], {replaceUrl: true});
          }, 100);
        }, (error) => {
          this.errors.invalidCredentials = true;
          this.errorMessage = error.error.errorMessages[0];
        }
      );
    }
  }

  signUp() {
    this.handleErrors();

    if (this.form.status === 'VALID') {
      if (this.tokenRequestSubscription) {
        // cancel previous token request
        this.tokenRequestSubscription.unsubscribe();
      }

      this.tokenRequestSubscription = this.authenticationService.signUp({email: this.form.value.email, password: this.form.value.password})
        .subscribe(() => {
          this.signedUp = true;
          this.signUpMessage = 'Signed up successfully!';
        }, (error) => {
          this.signedUp = false;
          this.signUpMessage = error.error.errorMessages[0];

        }
      );
    }
  }

  onInputChange(event, inputType) {
    if (event) {
      if (inputType === 'username') {
        this.errors.requiredUsername = false;
      } else {
        this.errors.requiredPassword = false;
      }
    }
  }

  ngOnDestroy() {
    if (this.tokenRequestSubscription) {
      this.tokenRequestSubscription.unsubscribe();
    }
  }
}
