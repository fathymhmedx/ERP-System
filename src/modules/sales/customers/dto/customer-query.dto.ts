import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class CustomerQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  search?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;
}
