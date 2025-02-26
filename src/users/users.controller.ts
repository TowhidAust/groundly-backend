import { Body, Controller, Patch, Req } from '@nestjs/common';
import { Request } from 'express';
import { UpdateUserDto } from './users.dto';
import { UserService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UserService) {}
  @Patch('update-profile/:id')
  updateProfile(@Req() req: Request, @Body() body: UpdateUserDto) {
    return this.userService.updateProfile(req, body);
  }
}
