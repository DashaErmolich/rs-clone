import { userModel } from 'src/app/models/userDto.models';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: userModel;
}