import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UpdateUserDto } from './users.dto';
import { UserService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('profile/:id')
  getProfile(@Req() req: Request) {
    return this.userService.getUserProfile(req);
  }

  @UseGuards(AuthGuard)
  @Patch('update-profile/:id')
  updateProfile(@Req() req: Request, @Body() body: UpdateUserDto) {
    return this.userService.updateUserProfile(req, body);
  }
}
