import { Body, Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/auth-user.interface';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersControllers {
  constructor(private readonly usersService: UsersService) {}

  @SuccessMessage('Users retrieved successfully')
  @Get()
  @Permissions('users.read')
  getUsers() {
    return this.usersService.findAll();
  }

  @SuccessMessage('Profile retrieved successfully')
  @Get('me')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.getProfile(user.id);
  }
}
