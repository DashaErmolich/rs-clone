import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverUrl } from 'src/app/constants/constants';
import { AuthResponse } from 'src/app/models/auth-response.models';
import { userModel } from 'src/app/models/userDto.models';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  constructor(private http: HttpClient) {}

  
}
