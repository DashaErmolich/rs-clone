import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverUrl } from '../constants/constants';
import { AuthResponse } from '../models/auth-response.models';
import { userDto } from '../models/userDto.models';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
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

  fetchUsers () {
    return this.http.get<userDto[]>(`${serverUrl}/users`);
  }
}