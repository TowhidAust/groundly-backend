import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseType } from 'src/types';
import { UpdateUserDto } from './users.dto';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor() {}
  async updateProfile(
    req: Request,
    body: UpdateUserDto,
  ): Promise<ResponseType> {
    const userId = req.params.id;
    console.log(userId);
    console.log(body);
    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: body,
    };
  }
}
