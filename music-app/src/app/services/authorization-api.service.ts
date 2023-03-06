import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_PROD_URL } from 'src/app/constants/constants';
import { IAuthResponse } from 'src/app/models/auth-response.models';
import { IUserModel } from 'src/app/models/user-model.models';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationApiService {
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<IAuthResponse>(`${SERVER_PROD_URL}/login`, { email, password });
  }

  registration(username: string, email: string, password: string) {
    return this.http.post<IAuthResponse>(`${SERVER_PROD_URL}/registration`, { username, email, password });
  }

  logout() {
    return this.http.post(`${SERVER_PROD_URL}/logout`, {});
  }

  refresh() {
    return this.http.get<IAuthResponse>(`${SERVER_PROD_URL}/refresh`);
  }

  fetchUsers() {
    return this.http.get<IUserModel[]>(`${SERVER_PROD_URL}/users`);
  }

  setAccountSettings(email: string, username: string, userIconId: number) {
    return this.http.post<IUserModel>(`${SERVER_PROD_URL}/settings`, { email, username, userIconId });
  }

  setUser(changedUser: IUserModel) {
    return this.http.post<IUserModel>(`${SERVER_PROD_URL}/setter`, { changedUser });
  }

  getUser() {
    return this.http.get<IUserModel | {}>(`${SERVER_PROD_URL}/user`);
  }
}
