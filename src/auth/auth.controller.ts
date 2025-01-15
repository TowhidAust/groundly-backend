import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseType } from 'src/types';
import { CreateUserDto } from './create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Get('login')
  async find(): Promise<ResponseType> {
    return this.authService.login();
  }
  @Post('signup')
  async create(@Body() createUser: CreateUserDto): Promise<ResponseType> {
    return this.authService.signup(createUser);
  }
}
