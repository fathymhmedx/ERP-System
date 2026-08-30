import { Deduction } from '../entities/deduction.entity';
import { DeductionResponseDto } from '../dto';

export class DeductionMapper {
  static toResponseDto(deduction: Deduction): DeductionResponseDto {
    return {
      id: deduction.id,
      amount: deduction.amount,
      reason: deduction.reason,
      date: deduction.date,
      employee: {
        id: deduction.employee.id,
        employeeNumber: deduction.employee.employeeNumber,
        firstName: deduction.employee.firstName,
        lastName: deduction.employee.lastName,
      },
      createdAt: deduction.createdAt,
      updatedAt: deduction.updatedAt,
    };
  }

  static toResponseDtos(deductions: Deduction[]): DeductionResponseDto[] {
    return deductions.map((deduction) =>
      DeductionMapper.toResponseDto(deduction),
    );
  }
}
