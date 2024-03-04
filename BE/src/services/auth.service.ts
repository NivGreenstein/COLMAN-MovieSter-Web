import { revokeRefreshToken } from './refreshToken.service';
import * as userService from './user.service';

export const login = async (email: string, password: string) => {
  return await userService.login(email, password);
};

export const logout = async (refreshToken: string) => {
  return await revokeRefreshToken(refreshToken);
};

export const googleLogin = async (email: string, name: string, profilePictureUrl: string) => {
  return await userService.googleLogin(email, name, profilePictureUrl);
};
