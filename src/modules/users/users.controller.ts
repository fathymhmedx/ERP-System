import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/auth/auth-user.interface';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import {
  CreateUserDto,
  GetUsersQueryDto,
  ResetPasswordDto,
  UserResponseDto,
} from './dto';

@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SuccessMessage('Profile retrieved successfully')
  @Get('me')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.usersService.getProfile(user.id);
  }

  @SuccessMessage('Users retrieved successfully')
  @Get()
  @Permissions(PERMISSIONS.USERS.READ)
  getUsers(@Query() query: GetUsersQueryDto) {
    return this.usersService.getUsers(query);
  }

  @SuccessMessage('User retrieved successfully')
  @Get(':id')
  @Permissions(PERMISSIONS.USERS.READ)
  getUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUser(id);
  }

  @SuccessMessage('User activated successfully')
  @Patch(':id/activate')
  @Permissions(PERMISSIONS.USERS.ACTIVATE)
  activateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.activateUser(id);
  }

  @SuccessMessage('User deactivated successfully')
  @Patch(':id/deactivate')
  @Permissions(PERMISSIONS.USERS.DEACTIVATE)
  deactivateUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deactivateUser(id);
  }

  @SuccessMessage('Password reset successfully')
  @Patch(':id/reset-password')
  @Permissions(PERMISSIONS.USERS.RESET_PASSWORD)
  resetPassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(id, resetPasswordDto);
  }

  @Post()
  @Permissions(PERMISSIONS.USERS.CREATE)
  @SuccessMessage('User created successfully')
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }
}
