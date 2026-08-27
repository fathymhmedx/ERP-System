import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { PositionsService } from './positions.service';

import {
  CreatePositionDto,
  PositionResponseDto,
  UpdatePositionDto,
} from './dto';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

@Controller({
  path: 'positions',
  version: '1',
})
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  /**
   * Create a new position.
   */
  @Post()
  @Permissions(PERMISSIONS.POSITIONS.CREATE)
  @SuccessMessage('Position created successfully')
  create(
    @Body() createPositionDto: CreatePositionDto,
  ): Promise<PositionResponseDto> {
    return this.positionsService.create(createPositionDto);
  }

  /**
   * Retrieve all positions.
   */
  @Get()
  @Permissions(PERMISSIONS.POSITIONS.READ)
  findAll(): Promise<PositionResponseDto[]> {
    return this.positionsService.findAll();
  }

  /**
   * Retrieve position by id.
   */
  @Get(':id')
  @Permissions(PERMISSIONS.POSITIONS.READ)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PositionResponseDto> {
    return this.positionsService.findOne(id);
  }

  /**
   * Update position.
   */
  @Patch(':id')
  @Permissions(PERMISSIONS.POSITIONS.UPDATE)
  @SuccessMessage('Position updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ): Promise<PositionResponseDto> {
    return this.positionsService.update(id, updatePositionDto);
  }

  /**
   * Soft delete position.
   */
  @Delete(':id')
  @Permissions(PERMISSIONS.POSITIONS.DELETE)
  @SuccessMessage('Position deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.positionsService.remove(id);
  }
}
