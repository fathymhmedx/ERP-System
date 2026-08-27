import { IsUUID } from 'class-validator';

export class AssignPositionDto {
  @IsUUID()
  positionId!: string;
}
