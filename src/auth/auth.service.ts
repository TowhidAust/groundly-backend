import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Login } from 'src/schema';
import { ResponseType } from 'src/types';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Login.name)
    private loginModel: mongoose.Model<Login>,
  ) {}
  async login(): Promise<ResponseType> {
    try {
      const loggedInUser = await this.loginModel.findById('yoyoy').exec();
      console.log(loggedInUser);
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
      const response = await this.loginModel.create(createUserDto);
      if (response) {
        return {
          statusCode: 201,
          message: 'Signup success',
          data: response,
        };
      }
    } catch (error) {
      if (error) {
        throw new NotFoundException('Not Created');
      }
    }
  }
}
