import { IsUUID } from 'class-validator';

export class AssignUserDto {
  @IsUUID()
  userId!: string;
}
