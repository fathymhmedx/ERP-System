import { IsIn, IsOptional } from 'class-validator';
import { MODULES } from 'src/common/constants/modules.constants';

export class GetPermissionsQueryDto {
  @IsOptional()
  @IsIn(MODULES)
  module?: string;
}
