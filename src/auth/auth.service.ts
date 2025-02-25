import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/schema';
import { ResponseType } from 'src/types';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user-dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private loginModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}
  async login(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<ResponseType> {
    try {
      const loggedInUser = await this.loginModel
        .findOne({
          email: loginUserDto.email,
          password: loginUserDto.password,
        })
        .exec();
      if (!loggedInUser) {
        throw new NotFoundException('Incorrect credentials');
      }
      const userObject = loggedInUser.toObject();
      delete userObject.password;
      // generate tokens
      const { accessToken, refreshToken } = await this.generateTokens({
        userId: loggedInUser?._id?.toString(),
        email: loggedInUser?.email,
      });
      // Set refresh token as a secure, HttpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true, // Use HTTPS in production
        sameSite: 'strict',
        path: '/auth/refresh', // Restrict cookie usage to this endpoint
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      // match the password is ok or not
      if (loggedInUser && loginUserDto.password === loggedInUser.password) {
        return {
          statusCode: 200,
          message: 'Successfully logged in',
          data: userObject,
          accessToken,
          refreshToken,
        };
      }
      // throw new Error('Incorrect credentials');
    } catch (error) {
      if (error) {
        throw new NotFoundException('Incorrect credentials');
      }
    }
  }

  async signup(createUserDto: CreateUserDto): Promise<ResponseType> {
    try {
      // find if this user already exists
      const isUserExists = await this.loginModel.findOne({
        email: createUserDto.email,
      });

      if (isUserExists) {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: 'The user already exists',
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // finally create the user if the user is new
      const response = await this.loginModel.create(createUserDto);
      if (response) {
        return {
          statusCode: 201,
          message: 'Signup success',
          data: response,
        };
      }
    } catch (error) {
      if (error?.status === 403) {
        throw new HttpException(error?.response?.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateTokens(payload: { userId: string; email: string }) {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_ACCESS_TOKEN,
      expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      expiresIn: process.env.JWT_REFRESH_EXPIRES,
    });

    return { accessToken, refreshToken };
  }

  async generateRefreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      });
      const { userId, email } = decoded;
      return this.generateTokens({ userId, email });
    } catch (error) {
      if (error) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }
  }
}
