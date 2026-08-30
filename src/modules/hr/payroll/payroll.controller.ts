import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { PayrollService } from './payroll.service';
import {
  GeneratePayrollDto,
  CreateBonusDto,
  CreateDeductionDto,
  PayrollQueryDto,
  BonusQueryDto,
  DeductionQueryDto,
  PayrollResponseDto,
  BonusResponseDto,
  DeductionResponseDto,
} from './dto';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';

@Controller({
  path: 'payroll',
  version: '1',
})
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // --- Payrolls ---
  @Post('generate')
  @Permissions(PERMISSIONS.PAYROLL.GENERATE)
  @SuccessMessage('Payroll generated successfully')
  generatePayroll(
    @Body() generatePayrollDto: GeneratePayrollDto,
  ): Promise<PayrollResponseDto> {
    return this.payrollService.generatePayroll(generatePayrollDto);
  }

  @Get()
  @Permissions(PERMISSIONS.PAYROLL.READ)
  findAll(
    @Query() query: PayrollQueryDto,
  ): Promise<PaginatedResponse<PayrollResponseDto>> {
    return this.payrollService.findAll(query);
  }

  // --- Bonuses ---

  @Get('bonuses')
  @Permissions(PERMISSIONS.PAYROLL.BONUS_READ)
  findBonuses(
    @Query() query: BonusQueryDto,
  ): Promise<PaginatedResponse<BonusResponseDto>> {
    return this.payrollService.findBonuses(query);
  }

  @Post('bonuses')
  @Permissions(PERMISSIONS.PAYROLL.BONUS_CREATE)
  @SuccessMessage('Bonus created successfully')
  createBonus(
    @Body() createBonusDto: CreateBonusDto,
  ): Promise<BonusResponseDto> {
    return this.payrollService.createBonus(createBonusDto);
  }

  @Delete('bonuses/:id')
  @Permissions(PERMISSIONS.PAYROLL.BONUS_DELETE)
  @SuccessMessage('Bonus deleted successfully')
  removeBonus(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.payrollService.removeBonus(id);
  }

  // --- Deductions ---
  @Get('deductions')
  @Permissions(PERMISSIONS.PAYROLL.DEDUCTION_READ)
  findDeductions(
    @Query() query: DeductionQueryDto,
  ): Promise<PaginatedResponse<DeductionResponseDto>> {
    return this.payrollService.findDeductions(query);
  }

  @Post('deductions')
  @Permissions(PERMISSIONS.PAYROLL.DEDUCTION_CREATE)
  @SuccessMessage('Deduction created successfully')
  createDeduction(
    @Body() createDeductionDto: CreateDeductionDto,
  ): Promise<DeductionResponseDto> {
    return this.payrollService.createDeduction(createDeductionDto);
  }

  @Delete('deductions/:id')
  @Permissions(PERMISSIONS.PAYROLL.DEDUCTION_DELETE)
  @SuccessMessage('Deduction deleted successfully')
  removeDeduction(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.payrollService.removeDeduction(id);
  }

  // --- Payroll by ID ---

  @Get(':id')
  @Permissions(PERMISSIONS.PAYROLL.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PayrollResponseDto> {
    return this.payrollService.findOne(id);
  }
}
