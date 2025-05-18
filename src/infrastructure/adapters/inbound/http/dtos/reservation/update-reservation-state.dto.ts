import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateReservationStateDto {
  @ApiProperty({
    description: 'ID del estado de reserva',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  stateId: number;
}
