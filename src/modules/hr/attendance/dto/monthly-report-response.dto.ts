export class MonthlyReportResponseDto {
  employeeId!: string;

  year!: number;

  month!: number;

  totalAttendanceDays!: number;

  presentDays!: number;

  lateDays!: number;

  absentDays!: number;

  leaveDays!: number;

  totalWorkingHours!: number;
}
