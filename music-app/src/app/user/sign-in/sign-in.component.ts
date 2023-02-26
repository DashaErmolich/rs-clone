import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, take } from 'rxjs';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { AuthorizationService } from 'src/app/services/authorization.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StateService } from 'src/app/services/state.service';
import { StatusCodes } from 'src/app/enums/statusCodes';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  saving = false;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,16}$/)]),
  });

  constructor(
    private state: StateService,
    private authServe: AuthorizationService,
    private authApiServe: AuthorizationApiService,
    private localStore: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  onSubmit(form: FormGroup) {
    this.saving = true;
    const formValue = this.loginForm.value;

    if (form.valid) {

      if (formValue.email && formValue.password) {
        this.authApiServe.login(formValue.email, formValue.password).pipe(
          take(1),
          catchError((err) => {
            this.saving = false;
            if (err instanceof HttpErrorResponse && err.status === StatusCodes.BadRequest) {
              const errReason = err.error.message.split(' ')[1];
              // eslint-disable-next-line default-case
              switch (errReason) {
                case 'email': {
                  const emailField = this.loginForm.get('email');
                  emailField?.setErrors({
                    emailError: 'Incorrect email',
                  });
                  break;
                }
                case 'password': {
                  const passwordField = this.loginForm.get('password');
                  passwordField?.setErrors({
                    passwordError: 'Incorrect password',
                  });
                  break;
                }
              }
            }
            return [];
          }),
        ).subscribe((res) => {
          this.localStore.setToken(res.accessToken);
          this.state.setAuthorized(true);
          this.state.setUser(res.user);
          this.snackBar.open('Successful login! Welcome', '✅', {
            duration: 3000,
          });
          
          setTimeout(() => {
            this.router.navigate(['music/home']);
          }, 1000);
        });
      }
    }
  }
}
