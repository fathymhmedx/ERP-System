import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PaymobTransactionSourceDataDto {
  @IsString()
  pan!: string;

  @IsString()
  sub_type!: string;

  @IsString()
  type!: string;
}

export class PaymobTransactionOrderDto {
  @IsInt()
  id!: number;

  @IsOptional()
  @IsString()
  merchant_order_id!: string | null;
}

export class PaymobTransactionWebhookDataDto {
  @IsInt()
  id!: number;

  @IsBoolean()
  pending!: boolean;

  @IsNumber()
  amount_cents!: number;

  @IsBoolean()
  success!: boolean;

  @IsBoolean()
  is_auth!: boolean;

  @IsBoolean()
  is_capture!: boolean;

  @IsBoolean()
  is_standalone_payment!: boolean;

  @IsBoolean()
  is_voided!: boolean;

  @IsBoolean()
  is_refunded!: boolean;

  @IsBoolean()
  is_3d_secure!: boolean;

  @IsBoolean()
  error_occured!: boolean;

  @IsBoolean()
  has_parent_transaction!: boolean;

  @IsInt()
  integration_id!: number;

  @IsInt()
  owner!: number;

  @ValidateNested()
  @Type(() => PaymobTransactionSourceDataDto)
  source_data!: PaymobTransactionSourceDataDto;

  @ValidateNested()
  @Type(() => PaymobTransactionOrderDto)
  order!: PaymobTransactionOrderDto;

  @IsString()
  created_at!: string;

  @IsOptional()
  @IsString()
  paid_at!: string | null;

  @IsString()
  currency!: string;
}

export class PaymobTransactionWebhookDto {
  @IsString()
  type!: string;

  @ValidateNested()
  @Type(() => PaymobTransactionWebhookDataDto)
  obj!: PaymobTransactionWebhookDataDto;
}
