import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ReservationWithRelationsResponseDto } from '../dtos/reservation/reservation-with-relations-response.dto';
import { IReservationApplicationPort } from 'src/core/application/ports/inbound/reservation-application.port';
import { CreateReservationResponseDto } from '../dtos/reservation/create-reservation-response.dto';
import { CreateReservationRequestDto } from '../dtos/reservation/create-reservation-request.dto';
import { AvailableTimeslotsQueryDto } from '../dtos/time-slot/available-timeslots-query.dto';
import { UpdateReservationStateDto } from '../dtos/reservation/update-reservation-state.dto';
import { UpdateReservationStatusDto } from '../dtos/reservation/update-reservation-status.dto';
import { TimeslotResponseDto } from '../dtos/time-slot/timeslot-response.dto';
import { IUserRequest } from 'src/infrastructure/types/user-request.type';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { PageOptionsDto } from '../dtos/common/page-options.dto';
import { Request as ExpressRequest } from 'express';
import { PageDto } from '../dtos/common/page.dto';
import { AuthGuard } from '@nestjs/passport';

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
  @ApiOperation({ 
    summary: 'Obtiene listado paginado de reservas con filtros',
    description: 'Permite filtrar reservas por escenario, área de actividad, barrio y usuario específico'
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto libre para búsqueda en nombres y ubicaciones' })
  @ApiQuery({ name: 'scenarioId', required: false, type: Number, description: 'Filtra por escenario específico' })
  @ApiQuery({ name: 'activityAreaId', required: false, type: Number, description: 'Filtra por área de actividad' })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: Number, description: 'Filtra por barrio (id)' })
  @ApiQuery({ name: 'userId', required: false, type: Number, description: '🆕 Filtra por usuario específico - muestra solo las reservas de ese usuario' })
  @ApiResponse({ status: 200, type: PageDto, description: 'Lista paginada de reservas con relaciones completas' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async getReservations(
    @Query() opts: PageOptionsDto,
  ): Promise<PageDto<ReservationWithRelationsResponseDto>> {
    return this.reservationService.listReservations(opts);
  }

  @Get('states')
  @ApiOperation({
    summary: 'Obtiene todos los estados de reserva disponibles',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de estados de reserva',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          state: { type: 'string' },
        },
      },
    },
  })
  async getReservationStates(): Promise<{ id: number; state: string }[]> {
    return this.reservationService.getAllReservationStates();
  }

  @Patch(':id/state')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: 'Actualiza el estado de una reserva por ID de estado (JWT requerido)',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la reserva',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Reserva actualizada exitosamente',
    type: ReservationWithRelationsResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateReservationState(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationStateDto,
  ): Promise<ReservationWithRelationsResponseDto> {
    return this.reservationService.updateReservationState(id, dto);
  }
}
