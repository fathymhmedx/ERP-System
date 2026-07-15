import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
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
}
