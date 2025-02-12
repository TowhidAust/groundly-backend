import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseType } from 'src/types';
import { CreateUserDto } from './create-user.dto';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { LoginUserDto } from './login-user-dto';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async find(@Body() loginUser: LoginUserDto): Promise<ResponseType> {
    return this.authService.login(loginUser);
  }
  @Post('signup')
  async create(@Body() createUser: CreateUserDto): Promise<ResponseType> {
    return this.authService.signup(createUser);
  }
}
