export interface ResponseType {
  statusCode: number;
  message: string;
  data: any;
  accessToken?: string;
  refreshToken?: string;
}
