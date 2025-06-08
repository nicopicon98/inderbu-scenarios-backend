import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TimeslotDto } from './base-reservation.dto';

/**
 * DTO para respuesta de disponibilidad de timeslots
 * Consolida TimeslotAvailabilityResponseDto
 */
export class AvailabilityResponseDto {
  @ApiProperty({ example: 16 })
  @Expose()
  readonly subScenarioId: number;

  @ApiProperty({ example: '2025-06-09' })
  @Expose()
  readonly date: string;

  @ApiProperty({ type: [TimeslotDto] })
  @Expose()
  @Type(() => TimeslotDto)
  readonly timeslots: TimeslotDto[];

  @ApiProperty({ example: 5 })
  @Expose()
  readonly totalAvailable: number;

  @ApiProperty({ example: 18 })
  @Expose()
  readonly totalTimeslots: number;

  @ApiPropertyOptional({ example: '2025-06-08T10:30:00Z' })
  @Expose()
  readonly queriedAt?: string;
}

// Type alias para backward compatibility
export type TimeslotAvailabilityResponseDto = AvailabilityResponseDto;
