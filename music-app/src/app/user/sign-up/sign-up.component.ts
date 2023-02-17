import { Component } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { StateService } from 'src/app/core/services/state.service';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  matcher = new MyErrorStateMatcher();

  hide = true;

  constructor(
    private store: StateService
  ) { }

  signInForm: any = {
    username: '',
    email: '',
    password: ''
  }

  submitRegistrationForm() {
    // this.authServe.registration(this.signInForm.username, this.signInForm.email, this.signInForm.password).subscribe((res) => {
    //   console.log(res)
    // })
    this.store.registration(this.signInForm.username, this.signInForm.email, this.signInForm.password);
  }
  submitLogout() {
    this.store.logout();
  }
}
