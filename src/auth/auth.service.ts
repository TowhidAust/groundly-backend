import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/schema';
import { ResponseType } from 'src/types';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user-dto';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private loginModel: mongoose.Model<User>,
    private jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginUserDto): Promise<ResponseType> {
    try {
      const loggedInUser = await this.loginModel
        .findOne({ email: loginUserDto.email, password: loginUserDto.password })
        .exec();
      const accessToken = await this.jwtService.signAsync({
        id: loggedInUser._id.toString(),
      });
      // match the password is ok or not
      if (loggedInUser) {
        return {
          statusCode: 200,
          message: 'Successfully logged in',
          data: loggedInUser,
          accessToken,
        };
      }
      throw new Error('Incorrect credentials');
    } catch (error) {
      console.log(error);
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
}
