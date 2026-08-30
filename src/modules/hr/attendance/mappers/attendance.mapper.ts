import { Attendance } from '../entities/attendance.entity';
import { AttendanceResponseDto } from '../dto';

export class AttendanceMapper {
  static toResponseDto(attendance: Attendance): AttendanceResponseDto {
    return {
      id: attendance.id,
      date: attendance.date,
      checkIn: attendance.checkIn,
      checkOut: attendance.checkOut,
      status: attendance.status,
      employee: {
        id: attendance.employee.id,
        employeeNumber: attendance.employee.employeeNumber,
        firstName: attendance.employee.firstName,
        lastName: attendance.employee.lastName,
      },
      createdAt: attendance.createdAt,
      updatedAt: attendance.updatedAt,
    };
  }

  static toResponseDtos(attendances: Attendance[]): AttendanceResponseDto[] {
    return attendances.map((attendance) =>
      AttendanceMapper.toResponseDto(attendance),
    );
  }
}
