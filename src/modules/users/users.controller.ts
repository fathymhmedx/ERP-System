import { Controller, Get, Version } from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller()
export class UsersControllers {
  constructor(private readonly usersService: UsersService) {}
  @SuccessMessage('Users retrieved successfully')
  @Get('users')
  @Version('1')
  getUsers() {
    return this.usersService.findAll();
  }
}
