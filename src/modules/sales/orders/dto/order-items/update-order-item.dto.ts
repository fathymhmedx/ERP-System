import { IsInt, Min } from 'class-validator';

export class UpdateOrderItemDto {
  @IsInt()
  @Min(1)
  quantity!: number;
}
