import { Component } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { StateService } from 'src/app/core/services/state.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private authServe: AuthService,
    private store: StateService
  ) { }

  // signInForm: FormGroup;

  // constructor() {
  //   this.signInForm = new FormGroup({
  //     username: new FormControl(null),
  //     email: new FormControl(null),
  //     password: new FormControl(null)
  //   })
  //   this.signInForm.valueChanges.subscribe((v) => {
  //     console.log(v)
  //   })
  // }

  signInForm: any = {
    username: '',
    email: '',
    password: ''
  }

  submitLoginForm() {
    // this.authServe.registration(this.signInForm.username, this.signInForm.email, this.signInForm.password).subscribe((res) => {
    //   console.log(res)
    // })
    this.store.login(this.signInForm.username, this.signInForm.email, this.signInForm.password)
  }
  submitLogout() {
    // this.store.logout();
    this.store.fetch();
    
  }
}
