import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetUserResponse, ResponseType, UserType } from 'src/types';
import { UpdateUserDto } from './users.dto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schema';
import mongoose from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}
  async getUserProfile(req: Request): Promise<GetUserResponse> {
    const userId: string = req.params.id;
    const user = await this.userModel.findById(userId).exec();
    const userObj: UserType = {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles: user.roles,
    };
    return {
      statusCode: HttpStatus.OK,
      message: 'Success',
      data: userObj,
    };
  }
  async updateUserProfile(
    req: Request,
    body: UpdateUserDto,
  ): Promise<ResponseType> {
    try {
      const userId = req?.params?.id;
      const updatedUser = await this.userModel.findByIdAndUpdate(
        userId,
        { $set: body },
        { new: true, runValidators: true },
      );
      if (!updatedUser) {
        throw new NotFoundException('User not found');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'success',
        data: updatedUser,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }
}
