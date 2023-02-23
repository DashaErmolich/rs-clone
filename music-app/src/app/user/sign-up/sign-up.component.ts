import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthorizationApiService } from 'src/app/services/authorization-api.service';
import { AuthorizationService } from 'src/app/services/authorization.service';  
import { StateService } from 'src/app/services/state.service';
import { take, catchError } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent {

  saving = false;
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.minLength(6), Validators.maxLength(16), Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,16}$/)]),
    confirm: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z]).{6,16}$/)])
  });

  constructor(
    private state: StateService,
    private authServe: AuthorizationService,
    private authApiServe: AuthorizationApiService,
    private builder: FormBuilder,
    private localStore: LocalStorageService
  ) { }

  onSubmit(form: FormGroup) {
    const formValue = this.registerForm.value;

    if (formValue.password !== formValue.confirm) {
      this.registerForm.get('confirm')?.setErrors({
        confirmError: 'Passwords does not match!'
      })
      return;
    }

    if (form.valid) {
      this.saving = true;
      
      if (formValue.name && formValue.email && formValue.password && formValue.confirm) {
          this.authApiServe.registration(formValue.name, formValue.email, formValue.password).pipe(take(1),
          catchError((err)=> {         
            if (err instanceof HttpErrorResponse) {
              if (err.status === 400) {
                const errReason = err.error.message.split(' ')[0];
                const emailField = this.registerForm.get('email');
                switch (errReason) {
                  case 'Email' : {
                    emailField?.setErrors({
                      serverError: 'E-mail has already taken'
                    })
                    break;
                  }
                  default: {
                    emailField?.setErrors({
                      validationError: 'Incorrect e-mail'
                    })
                    break;
                  }
                }
              }
            }
            return []
          })
          ).subscribe((res) => {
            this.localStore.setToken(res.accessToken)
            this.state.setAuthorized(true);
            this.state.setUser(res.user)
          })
      }
    }
  } 
}
