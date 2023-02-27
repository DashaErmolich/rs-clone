/* eslint-disable no-underscore-dangle */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { catchError, take, Subscription } from 'rxjs';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StateService } from 'src/app/services/state.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusCodes } from '../../enums/status-codes';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
  saving = false;

  _emailPlaceholder = '';

  _passwordPlaceholder = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,16}$/)]),
  });

  isHandset$ = new Subscription();

  isHandset = false;

  constructor(
    private state: StateService,
    private authApiServe: AuthorizationApiService,
    private localStore: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
    private responsive: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.isHandset$ = this.responsive.isSmall$.subscribe((data) => {
      this.isHandset = data;
    });
    this.setPlaceholders();
  }

  ngOnDestroy(): void {
    this.isHandset$.unsubscribe();
  }

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
                    emailError: 'sign-in.errors.emailError',
                  });
                  break;
                }
                case 'password': {
                  const passwordField = this.loginForm.get('password');
                  passwordField?.setErrors({
                    passwordError: 'sign-in.errors.passwordError',
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
          this.state.setUserToState(res.user);
          this.state.updateState();
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

  setPlaceholders() {
    const { cookie } = document;

    if (cookie.includes('ru-RU')) {
      this._emailPlaceholder = 'Почта';
      this._passwordPlaceholder = 'Пароль';
    } else {
      this._emailPlaceholder = 'E-mail';
      this._passwordPlaceholder = 'Password';
    }
  }
}
