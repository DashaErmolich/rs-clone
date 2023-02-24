import { IUserModel } from 'src/app/models/userModel.models';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserModel;
}