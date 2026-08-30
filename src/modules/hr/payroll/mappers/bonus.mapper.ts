import { Bonus } from '../entities/bonus.entity';
import { BonusResponseDto } from '../dto';

export class BonusMapper {
  static toResponseDto(bonus: Bonus): BonusResponseDto {
    return {
      id: bonus.id,
      amount: bonus.amount,
      reason: bonus.reason,
      date: bonus.date,
      employee: {
        id: bonus.employee.id,
        employeeNumber: bonus.employee.employeeNumber,
        firstName: bonus.employee.firstName,
        lastName: bonus.employee.lastName,
      },
      createdAt: bonus.createdAt,
      updatedAt: bonus.updatedAt,
    };
  }

  static toResponseDtos(bonuses: Bonus[]): BonusResponseDto[] {
    return bonuses.map((bonus) => BonusMapper.toResponseDto(bonus));
  }
}
