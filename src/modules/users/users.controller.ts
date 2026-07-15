import { Body, Controller, Get, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/auth-user.interface';
import { UpdateProfileDto } from './dto';

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

  @SuccessMessage('Profile updated successfully')
  @Patch('me')
  updateProfile(
    @CurrentUser() user: AuthUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }
}
