import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class SupplierQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  search?: string;
}
