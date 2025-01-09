import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

interface ResponseType {
  status: number;
  message: string;
  data: any;
}

@Controller('auth')
export class AuthController {
  @Get('login')
  findAll(): ResponseType {
    return {
      status: 200,
      message: 'Login success',
      data: [],
    };
  }
  @Post('signup')
  create(): ResponseType {
    const isError = true;
    if (isError) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Something went wrong!',
        },
        HttpStatus.FORBIDDEN,
        { cause: isError },
      );
    }
    return {
      status: 200,
      message: 'Signup success',
      data: [],
    };
  }
}
