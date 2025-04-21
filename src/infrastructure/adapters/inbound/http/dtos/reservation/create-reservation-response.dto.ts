import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: '2025-04-20' })
  reservationDate: string;

  @ApiProperty({ example: 1 })
  subScenarioId: number;

  @ApiProperty({ example: 5 })
  userId: number;

  @ApiProperty({ example: 10 })
  timeSlotId: number;

  @ApiProperty({ example: 1, description: 'ID del estado de reserva (PENDIENTE)' })
  reservationStateId: number;
}