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

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private loginModel: mongoose.Model<User>,
  ) {}
  async login(): Promise<ResponseType> {
    try {
      const loggedInUser = await this.loginModel.findById('yoyoy').exec();
      if (loggedInUser) {
        return {
          statusCode: 200,
          message: 'Successfully logged in',
          data: loggedInUser,
        };
      }
    } catch (error) {
      if (error) {
        throw new NotFoundException('User not found gg');
      }
    }
  }
  async signup(createUserDto: CreateUserDto): Promise<ResponseType> {
    try {
      // check if email and password is provided correctly
      if (createUserDto.email && createUserDto.password) {
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
      } else {
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            message: 'Please provide correct email/password',
          },
          HttpStatus.FORBIDDEN,
        );
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
