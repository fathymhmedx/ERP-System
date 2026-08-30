import Decimal from 'decimal.js';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';

import { EmployeesRepository } from '../employees/employees.repository';

import { PayrollRepository } from './repositories/payroll.repository';
import { BonusRepository } from './repositories/bonus.repository';
import { DeductionRepository } from './repositories/deduction.repository';

import { PayrollMapper } from './mappers/payroll.mapper';
import { BonusMapper } from './mappers/bonus.mapper';
import { DeductionMapper } from './mappers/deduction.mapper';

import { PayrollStatus } from './enums/payroll-status.enum';

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

import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';

@Injectable()
export class PayrollService {
  constructor(
    private readonly payrollRepository: PayrollRepository,
    private readonly bonusRepository: BonusRepository,
    private readonly deductionRepository: DeductionRepository,
    private readonly employeesRepository: EmployeesRepository,
    private readonly dataSource: DataSource,
  ) {}

  async generatePayroll(
    generatePayrollDto: GeneratePayrollDto,
  ): Promise<PayrollResponseDto> {
    const { employeeId, year, month } = generatePayrollDto;

    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const existingPayroll =
      await this.payrollRepository.findByEmployeeAndPeriod(
        employeeId,
        year,
        month,
      );

    if (existingPayroll) {
      throw new ConflictException(
        `Payroll for ${year}-${month} already generated for this employee`,
      );
    }

    try {
      return await this.dataSource.transaction(async (manager) => {
        const [totalBonus, totalDeduction] = await Promise.all([
          this.bonusRepository.getTotalForPeriod(
            manager,
            employeeId,
            year,
            month,
          ),
          this.deductionRepository.getTotalForPeriod(
            manager,
            employeeId,
            year,
            month,
          ),
        ]);

        const baseSalary = new Decimal(employee.baseSalary);
        const bonusTotal = new Decimal(totalBonus);
        const deductionTotal = new Decimal(totalDeduction);

        const netSalary = baseSalary.plus(bonusTotal).minus(deductionTotal);
        const savedPayroll = await this.payrollRepository.createAndSave(
          manager,
          {
            employee,
            year,
            month,
            baseSalary: baseSalary.toFixed(2),
            totalBonus: bonusTotal.toFixed(2),
            totalDeduction: deductionTotal.toFixed(2),
            netSalary: netSalary.toFixed(2),
            status: PayrollStatus.GENERATED,
          },
        );

        const payroll = await this.payrollRepository.findByIdWithEmployee(
          manager,
          savedPayroll.id,
        );

        if (!payroll) {
          throw new NotFoundException('Payroll not found');
        }

        return PayrollMapper.toResponseDto(payroll);
      });
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(
          `Payroll for ${year}-${month} already generated for this employee`,
        );
      }

      throw error;
    }
  }

  async findAll(
    query: PayrollQueryDto,
  ): Promise<PaginatedResponse<PayrollResponseDto>> {
    const [payrolls, total] =
      await this.payrollRepository.findAllWithFilters(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: PayrollMapper.toResponseDtos(payrolls),
    };
  }

  async findOne(id: string): Promise<PayrollResponseDto> {
    const payroll = await this.payrollRepository.findById(id, {
      relations: {
        employee: true,
      },
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    return PayrollMapper.toResponseDto(payroll);
  }

  async createBonus(createBonusDto: CreateBonusDto): Promise<BonusResponseDto> {
    const { employeeId, amount, reason, date } = createBonusDto;
    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const bonus = this.bonusRepository.create({
      employee,
      amount: amount,
      reason: reason,
      date: new Date(date),
    });

    const savedBonus = await this.bonusRepository.save(bonus);

    return BonusMapper.toResponseDto(savedBonus);
  }

  async findBonuses(
    query: BonusQueryDto,
  ): Promise<PaginatedResponse<BonusResponseDto>> {
    const [bonuses, total] =
      await this.bonusRepository.findAllWithFilters(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: BonusMapper.toResponseDtos(bonuses),
    };
  }

  async removeBonus(id: string): Promise<void> {
    const bonus = await this.bonusRepository.findById(id);

    if (!bonus) {
      throw new NotFoundException('Bonus not found');
    }

    await this.bonusRepository.softDelete({ id });
  }

  async createDeduction(
    createDeductionDto: CreateDeductionDto,
  ): Promise<DeductionResponseDto> {
    const { employeeId, amount, reason, date } = createDeductionDto;
    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const deduction = this.deductionRepository.create({
      employee,
      amount: amount,
      reason: reason,
      date: new Date(date),
    });

    const savedDeduction = await this.deductionRepository.save(deduction);

    return DeductionMapper.toResponseDto(savedDeduction);
  }

  async findDeductions(
    query: DeductionQueryDto,
  ): Promise<PaginatedResponse<DeductionResponseDto>> {
    const [deductions, total] =
      await this.deductionRepository.findAllWithFilters(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: DeductionMapper.toResponseDtos(deductions),
    };
  }

  async removeDeduction(id: string): Promise<void> {
    const deduction = await this.deductionRepository.findById(id);

    if (!deduction) {
      throw new NotFoundException('Deduction not found');
    }

    await this.deductionRepository.softDelete({ id });
  }

  private isUniqueViolation(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError as {
      code?: string;
    };

    return driverError.code === '23505';
  }
}
