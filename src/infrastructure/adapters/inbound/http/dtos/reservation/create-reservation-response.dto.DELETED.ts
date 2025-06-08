import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TimeSlotInfoDto {
  @ApiProperty({ example: 9 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: '09:00:00' })
  @Expose()
  readonly startTime: string;

  @ApiProperty({ example: '09:59:59' })
  @Expose()
  readonly endTime: string;
}

export class ReservationInstanceInfoDto {
  @ApiProperty({ example: 1 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: '2025-06-09' })
  @Expose()
  readonly reservationDate: string;

  @ApiProperty({ type: TimeSlotInfoDto })
  @Expose()
  readonly timeslot: TimeSlotInfoDto;
}

export class CreateReservationResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 16 })
  @Expose()
  readonly subScenarioId: number;

  @ApiProperty({ example: 123 })
  @Expose()
  readonly userId: number;

  @ApiProperty({ example: 'RANGE' })
  @Expose()
  readonly type: string;

  @ApiProperty({ example: '2025-06-09' })
  @Expose()
  readonly initialDate: string;

  @ApiProperty({ example: '2025-06-17' })
  @Expose()
  readonly finalDate: string | null;

  @ApiProperty({ example: [1, 3, 5] })
  @Expose()
  readonly weekDays: number[] | null;

  @ApiProperty({ example: 'Reserva para evento especial' })
  @Expose()
  readonly comments: string | null;

  @ApiProperty({ example: 1 })
  @Expose()
  readonly reservationStateId: number;

  @ApiProperty({ type: [TimeSlotInfoDto] })
  @Expose()
  readonly timeslots: TimeSlotInfoDto[];

  @ApiProperty({ type: [ReservationInstanceInfoDto] })
  @Expose()
  readonly instances: ReservationInstanceInfoDto[];

  @ApiProperty({ example: 36 })
  @Expose()
  readonly totalInstances: number;

  @ApiProperty({ example: '2025-06-08T10:30:00Z' })
  @Expose()
  readonly createdAt: string;

  @ApiProperty({ example: '2025-06-08T10:30:00Z' })
  @Expose()
  readonly updatedAt: string;
}
