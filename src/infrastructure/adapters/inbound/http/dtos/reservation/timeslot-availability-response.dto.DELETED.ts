import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TimeslotAvailabilityDto {
  @ApiProperty({ example: 9 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: '09:00:00' })
  @Expose()
  readonly startTime: string;

  @ApiProperty({ example: '09:59:59' })
  @Expose()
  readonly endTime: string;

  @ApiProperty({ example: true })
  @Expose()
  readonly isAvailable: boolean;
}

export class TimeslotAvailabilityResponseDto {
  @ApiProperty({ example: 16 })
  @Expose()
  readonly subScenarioId: number;

  @ApiProperty({ example: '2025-06-09' })
  @Expose()
  readonly date: string;

  @ApiProperty({ type: [TimeslotAvailabilityDto] })
  @Expose()
  readonly timeslots: TimeslotAvailabilityDto[];

  @ApiProperty({ example: 5 })
  @Expose()
  readonly totalAvailable: number;

  @ApiProperty({ example: 18 })
  @Expose()
  readonly totalTimeslots: number;
}
