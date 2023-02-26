import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { StateService } from 'src/app/services/state.service';
import { take, catchError } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { StatusCodes } from 'src/app/enums/statusCodes';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {
  saving = false;
  _usernamePlaceholder = '';
  _emailPlaceholder = '';
  _passwordPlaceholder = '';
  _confirmPlaceholder = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^.{6,16}$/)]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,16}$/)]),
    confirm: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,16}$/)]),
  });

  constructor(
    private state: StateService,
    private authApiServe: AuthorizationApiService,
    private localStore: LocalStorageService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { this.setPlaceholders() }

  onSubmit(form: FormGroup) {
    this.saving = true;
      
    const formValue = this.registerForm.value;

    if (formValue.password !== formValue.confirm) {
      this.registerForm.get('confirm')?.setErrors({
        confirmError: 'Passwords does not match!',
      });
      return;
    }

    if (form.valid) {

      if (formValue.name && formValue.email && formValue.password && formValue.confirm) {
        this.authApiServe.registration(formValue.name, formValue.email, formValue.password).pipe(
          take(1),
          catchError((err) => {
            this.saving = false;
            if (err instanceof HttpErrorResponse) {
              if (err.status === StatusCodes.BadRequest) {
                const errReason = err.error.message.split(' ')[0];
                const emailField = this.registerForm.get('email');
                switch (errReason) {
                  case 'Email': {
                    emailField?.setErrors({
                      serverError: 'E-mail has already taken',
                    });
                    break;
                  }
                  default: {
                    emailField?.setErrors({
                      validationError: 'Incorrect e-mail',
                    });
                    break;
                  }
                }
              }
            }
            return [];
          }),
        ).subscribe((res) => {
          this.localStore.setToken(res.accessToken);
          this.state.setAuthorized(true);
          this.state.setUser(res.user);
          this.snackBar.open('Success! Please check the message that has been sent to your e-mail address', '✅', { 
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
    const cookie = document.cookie;
    
    if (cookie.includes('ru-RU')) {
      this._usernamePlaceholder = 'Имя пользователя'
      this._emailPlaceholder = 'Почта'
      this._passwordPlaceholder = 'Пароль'
      this._confirmPlaceholder = 'Подтвердите пароль'
    }
    else {
      this._usernamePlaceholder = 'Username'
      this._emailPlaceholder = 'E-mail'
      this._passwordPlaceholder = 'Password'
      this._confirmPlaceholder = 'Conform password'
    }
  }
}
