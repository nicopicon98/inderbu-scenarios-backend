import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TimeSlotInfoDto } from './create-reservation-response.dto';

export class SubScenarioInfoDto {
  @ApiProperty({ example: 16 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 'Cancha de Fútbol A' })
  @Expose()
  readonly name: string;
}

export class UserInfoDto {
  @ApiProperty({ example: 123 })
  @Expose()
  readonly id: number;

  @ApiProperty({ example: 'John' })
  @Expose()
  readonly firstName: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  readonly lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  readonly email: string;
}

export class ReservationStateInfoDto {
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

export class ReservationWithDetailsResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  readonly id: number;

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

  @ApiProperty({ type: SubScenarioInfoDto })
  @Expose()
  readonly subScenario: SubScenarioInfoDto;

  @ApiProperty({ type: UserInfoDto })
  @Expose()
  readonly user: UserInfoDto;

  @ApiProperty({ type: ReservationStateInfoDto })
  @Expose()
  readonly reservationState: ReservationStateInfoDto;

  @ApiProperty({ type: [TimeSlotInfoDto] })
  @Expose()
  readonly timeslots: TimeSlotInfoDto[];

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
