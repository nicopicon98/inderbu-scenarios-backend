import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum ReservationStatus {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  CANCELADA = 'CANCELADA'
}

export class UpdateReservationStatusDto {
  @ApiProperty({
    description: 'Estado de la reserva',
    enum: ReservationStatus,
    example: 'CONFIRMADA',
  })
  @IsNotEmpty()
  @IsEnum(ReservationStatus)
  status: ReservationStatus;
}
