import { Injectable } from '@nestjs/common';
import { ResponseType } from 'src/types';

@Injectable()
export class AuthService {
  login(): ResponseType {
    return {
      status: 200,
      message: 'Login success',
      data: [],
    };
  }
  signup(): ResponseType {
    return {
      status: 201,
      message: 'Signup success',
      data: [],
    };
  }
}
