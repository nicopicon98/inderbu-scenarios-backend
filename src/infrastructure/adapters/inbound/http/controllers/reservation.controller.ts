import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { IReservationApplicationPort } from 'src/core/application/ports/inbound/reservation-application.port';
import { AvailableTimeslotsQueryDto } from '../dtos/time-slot/available-timeslots-query.dto';
import { TimeslotResponseDto } from '../dtos/time-slot/timeslot-response.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { CreateReservationRequestDto } from '../dtos/reservation/create-reservation-request.dto';
import { CreateReservationResponseDto } from '../dtos/reservation/create-reservation-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { IUserRequest } from 'src/infrastructure/types/user-request.type';
import { PageOptionsDto } from '../dtos/common/page-options.dto';
import { PageDto } from '../dtos/common/page.dto';
import { ReservationWithRelationsResponseDto } from '../dtos/reservation/reservation-with-relations-response.dto';

@ApiBearerAuth('jwt-auth')
@Controller('reservations')
export class ReservationController {
  constructor(
    @Inject(APPLICATION_PORTS.RESERVATION)
    private readonly reservationService: IReservationApplicationPort,
  ) {}

  @Get('available-timeslots')
  @ApiOperation({
    summary: 'Obtiene Timeslots disponibles para SubEscenario y Fecha',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async availableTimeSlots(
    @Query() query: AvailableTimeslotsQueryDto,
  ): Promise<TimeslotResponseDto[]> {
    const { subScenarioId, date } = query;
    return this.reservationService.getAvailableTimeSlots(
      subScenarioId,
      new Date(date), // se convierte a Date sin horas
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Crea una nueva reserva (JWT requerido)' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() dto: CreateReservationRequestDto,
    @Request() req: ExpressRequest & IUserRequest,
  ): Promise<CreateReservationResponseDto> {
    console.log("hi there");
    const userId = req.user.userId; // Se obtiene el userId del token JWT
    return this.reservationService.createReservation(dto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Obtiene listado paginado de reservas' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto libre para búsqueda' })
  @ApiQuery({ name: 'scenarioId', required: false, type: Number, description: 'Filtra por escenario' })
  @ApiQuery({ name: 'activityAreaId', required: false, type: Number, description: 'Filtra por área de actividad' })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: Number, description: 'Filtra por barrio (id)' })
  @ApiResponse({ status: 200, type: PageDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReservations(
    @Query() opts: PageOptionsDto,
  ): Promise<PageDto<ReservationWithRelationsResponseDto>> {
    return this.reservationService.listReservations(opts);
  }

}
