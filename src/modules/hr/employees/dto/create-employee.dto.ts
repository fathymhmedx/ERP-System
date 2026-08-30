import {
  IsDate,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  employeeNumber!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dateOfBirth?: Date;

  @Type(() => Date)
  @IsDate()
  hireDate!: Date;

  @IsOptional()
  @IsDecimal({
    decimal_digits: '0,2',
  })
  baseSalary?: string;
}
