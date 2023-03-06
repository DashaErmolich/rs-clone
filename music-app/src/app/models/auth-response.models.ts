import { IUserModel } from 'src/app/models/user-model.models';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: IUserModel;
}
