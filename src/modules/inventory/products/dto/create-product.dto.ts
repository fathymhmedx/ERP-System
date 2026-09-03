import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  sku!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsUUID()
  categoryId!: string;

  @IsUUID()
  supplierId!: string;

  @IsDecimal(
    {
      decimal_digits: '0,2',
      force_decimal: false,
    },
    {
      message: 'Cost price must be a valid decimal with up to 2 decimal places',
    },
  )
  costPrice!: string;

  @IsDecimal(
    {
      decimal_digits: '0,2',
      force_decimal: false,
    },
    {
      message:
        'Selling price must be a valid decimal with up to 2 decimal places',
    },
  )
  sellingPrice!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentStock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderLevel?: number;
}
