import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseType } from 'src/types';
import { CreateUserDto } from './create-user.dto';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';

@UseFilters(new HttpExceptionFilter())
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
