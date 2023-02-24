import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { serverUrl } from 'src/app/constants/constants';
import { IAuthResponse } from 'src/app/models/auth-response.models';
import { IUserModel } from 'src/app/models/userModel.models';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationApiService {

  constructor(private http: HttpClient) {}

  login (email: string, password: string) {
    return this.http.post<IAuthResponse>(`${serverUrl}/login`, {email, password});
  }

  registration (username: string, email: string, password: string) {
    return this.http.post<IAuthResponse>(`${serverUrl}/registration`, {username, email, password});
  }

  logout () {
    return this.http.post(`${serverUrl}/logout`, {});
  }

  refresh () {
    return this.http.get<IAuthResponse>(`${serverUrl}/refresh`);
  }

  fetchUsers () {
    return this.http.get<IUserModel[]>(`${serverUrl}/users`);
  }

  setAccountSettings (email: string, username: string, userIconId: number) {
    return this.http.post<IUserModel>(`${serverUrl}/settings`, {email, username, userIconId});
  }

  setUser (changedUser: IUserModel) {
    return this.http.post<IUserModel>(`${serverUrl}/setter`, {changedUser});
  }

  getUser () {
    return this.http.get<IUserModel | {}>(`${serverUrl}/user`);
  }
}
