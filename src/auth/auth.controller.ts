import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

interface ResponseType {
  status: number;
  message: string;
  data: any;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('login')
  findAll(): ResponseType {
    return this.authService.login();
  }
  @Post('signup')
  create(): ResponseType {
    return this.authService.signup();
  }
}
