import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateBonusDto {
  @IsUUID()
  employeeId!: string;

  @Matches(/^(?!0+(?:\.0{1,2})?$)\d+(?:\.\d{1,2})?$/, {
    message: 'amount must be greater than 0 with up to 2 decimal places',
  })
  amount!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason!: string;

  @IsDateString()
  date!: string;
}
