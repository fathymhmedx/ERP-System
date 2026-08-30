import { Payroll } from '../entities/payroll.entity';
import { PayrollResponseDto } from '../dto';

export class PayrollMapper {
  static toResponseDto(payroll: Payroll): PayrollResponseDto {
    return {
      id: payroll.id,
      year: payroll.year,
      month: payroll.month,
      baseSalary: payroll.baseSalary,
      totalBonus: payroll.totalBonus,
      totalDeduction: payroll.totalDeduction,
      netSalary: payroll.netSalary,
      status: payroll.status,
      generatedAt: payroll.generatedAt,
      employee: {
        id: payroll.employee.id,
        employeeNumber: payroll.employee.employeeNumber,
        firstName: payroll.employee.firstName,
        lastName: payroll.employee.lastName,
      },
      createdAt: payroll.createdAt,
      updatedAt: payroll.updatedAt,
    };
  }

  static toResponseDtos(payrolls: Payroll[]): PayrollResponseDto[] {
    return payrolls.map((payroll) => PayrollMapper.toResponseDto(payroll));
  }
}
