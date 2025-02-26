import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseType } from 'src/types';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { HttpExceptionFilter } from 'src/exception-filters/http-exception.filter';
import { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';

@UseFilters(new HttpExceptionFilter())
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginUser: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType> {
    return this.authService.login(loginUser, res);
  }

  @Post('signup')
  async createUser(
    @Body() createUser: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseType> {
    return this.authService.signup(createUser, res);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.generateRefreshToken(refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: tokens.accessToken });
  }

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  getProfile(@Req() req: Request) {
    return this.authService.getUser(req);
  }
}
