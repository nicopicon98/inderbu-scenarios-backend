import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt, IsDateString, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({
    example: 'Partido de fútbol amistoso para niños',
    description: 'Comentarios adicionales sobre la reserva (opcional)',
    required: false
  })
  @IsOptional()
  @IsString()
  comments?: string;
}