import {
  ArrayMinSize,
  IsArray,
  IsDecimal,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { CreateOrderItemDto } from '../order-items/create-order-item.dto';

export class CreateOrderDto {
  @IsUUID()
  customerId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

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
