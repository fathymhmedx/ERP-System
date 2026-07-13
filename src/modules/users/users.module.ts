import { Module } from '@nestjs/common';
import { UsersControllers } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersControllers],
  providers: [UsersService],
})
export class UsersModule {}
