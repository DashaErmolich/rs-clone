import { userDto } from "./userDto.models";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: userDto;
}