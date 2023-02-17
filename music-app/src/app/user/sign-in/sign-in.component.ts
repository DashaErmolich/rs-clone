import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { StateService } from 'src/app/services/state.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  hide = true;

  constructor(
    private authServe: AuthorizationService,
    private store: StateService,
  ) { }

  signInForm: any = {
    username: '',
    email: '',
    password: ''
  }

  submitLoginForm() {
    this.authServe.login(this.signInForm.username, this.signInForm.email, this.signInForm.password)
  }
  submitLogout() {
    this.authServe.logout();
  }
  submitFetch() {
    this.authServe.fetch();
  }
  submitRefresh() {
    this.authServe.checkAuth();
  }
}
