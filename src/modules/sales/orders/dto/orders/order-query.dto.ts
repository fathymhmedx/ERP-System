import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { OrderStatus } from '../../enums/order-status.enum';

export class OrderQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
