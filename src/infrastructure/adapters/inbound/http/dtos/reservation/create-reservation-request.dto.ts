import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsDateString } from 'class-validator';

export class CreateReservationRequestDto {
  @ApiProperty({ example: 1, description: 'ID del SubScenario' })
  @IsNotEmpty()
  @IsInt()
  subScenarioId: number;

  @ApiProperty({ example: 10, description: 'ID del TimeSlot' })
  @IsNotEmpty()
  @IsInt()
  timeSlotId: number;

  @ApiProperty({
    example: '2025-04-20',
    description: 'Fecha de reserva en formato YYYY-MM-DD'
  })
  @IsNotEmpty()
  @IsDateString()
  reservationDate: string;
}