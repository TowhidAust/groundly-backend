import { UserType } from './global.types';

export interface ResponseType {
  statusCode: number;
  message: string;
  data: any;
  accessToken?: string;
  refreshToken?: string;
}

export interface GetUserResponse {
  statusCode: number;
  message: string;
  data: UserType;
}
