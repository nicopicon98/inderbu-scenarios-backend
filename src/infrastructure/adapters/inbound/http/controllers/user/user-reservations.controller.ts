import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { IReservationApplicationPort } from 'src/core/application/ports/inbound/reservation-application.port';
//   import { ReservationResponseDto } from '../dtos/reservation/reservation-response.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';

@ApiTags('Reservation')
@ApiBearerAuth('jwt-auth')
@Controller('users/:userId/reservations')
export class UserReservationsController {
  constructor() //   @Inject(APPLICATION_PORTS.RESERVATION)
  //   private readonly reservationService: IReservationApplicationPort,
  {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all reservations for a given user' })
  async findByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any /*ReservationResponseDto[]*/> {
    //   return this.reservationService.getReservationsByUser(userId);
    return null as unknown as any;
  }
}
