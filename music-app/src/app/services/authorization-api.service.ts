import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverUrl } from 'src/app/constants/constants';
import { AuthResponse } from 'src/app/models/auth-response.models';
import { userModel } from 'src/app/models/userDto.models';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationApiService {

  constructor(private http: HttpClient) {}

  login (username: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${serverUrl}/login`, {username, email, password});
  }

  registration (username: string, email: string, password: string) {
    return this.http.post<AuthResponse>(`${serverUrl}/registration`, {username, email, password});
  }

  logout () {
    return this.http.post(`${serverUrl}/logout`, {});
  }

  refresh () {
    return this.http.get<AuthResponse>(`${serverUrl}/refresh`);
  }

  fetchUsers () {
    return this.http.get<userModel[]>(`${serverUrl}/users`)
  }
}