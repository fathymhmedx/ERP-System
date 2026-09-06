import {
  IsDecimal,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsDecimal(
    {
      decimal_digits: '0,2',
      force_decimal: false,
    },
    {
      message: 'Discount must be a valid decimal with up to 2 decimal places',
    },
  )
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message:
      'Discount must be a non-negative decimal with up to 2 decimal places',
  })
  discount?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
