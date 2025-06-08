import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

/**
 * DTO base para información de Timeslot
 * Usado en múltiples respuestas 
 */
export class TimeslotDto {
  @ApiProperty({ example: 9 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: '09:00:00' })
  @Expose()
  readonly startTime: string;

  @ApiProperty({ example: '09:59:59' })
  @Expose()
  readonly endTime: string;

  @ApiPropertyOptional({ example: true })
  @Expose()
  readonly isAvailable?: boolean;
}

/**
 * DTO para información de SubScenario
 */
export class SubScenarioDto {
  @ApiProperty({ example: 16 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 'Cancha de Fútbol A' })
  @Expose()
  readonly name: string;

  @ApiPropertyOptional({ example: 'Descripción del sub-escenario' })
  @Expose()
  readonly description?: string;
}

/**
 * DTO para información de Usuario
 */
export class UserDto {
  @ApiProperty({ example: 123 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 'John' })
  @Expose()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  readonly lastName: string;

  @ApiProperty({ example: 'john@example.com' })
  @Expose()
  readonly email: string;
}

/**
 * DTO para información de Estado de Reserva
 */
export class ReservationStateDto {
  @ApiProperty({ example: 1 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 'PENDIENTE' })
  @Expose()
  readonly name: string;

  @ApiProperty({ example: 'La reserva está pendiente de confirmación' })
  @Expose()
  readonly description: string;
}

/**
 * DTO para instancias de reserva
 */
export class ReservationInstanceDto {
  @ApiProperty({ example: 1 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: '2025-06-09' })
  @Expose()
  readonly reservationDate: string;

  @ApiProperty({ type: TimeslotDto })
  @Expose()
  @Type(() => TimeslotDto)
  readonly timeslot: TimeslotDto;
}
