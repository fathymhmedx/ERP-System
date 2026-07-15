import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePermissionDto {
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsString()
  @MaxLength(100)
  module!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
