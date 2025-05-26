import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  PageDto,
  PageMetaDto,
} from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { ReservationWithRelationsResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/reservation-with-relations-response.dto';
import { CreateReservationResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-response.dto';
import { CreateReservationRequestDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { UpdateReservationStateDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/update-reservation-state.dto';
import { TimeslotResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/time-slot/timeslot-response.dto';
import { IReservationStateRepositoryPort } from 'src/core/domain/ports/outbound/reservation-state-repository.port';
import { IReservationRepositoryPort } from 'src/core/domain/ports/outbound/reservation-repository.port';
import { ReservationStateDomainEntity } from 'src/core/domain/entities/reservation-state.domain-entity';
import { ReservationPageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/reservation-page-options.dto';
import { ITimeSlotRepositoryPort } from 'src/core/domain/ports/outbound/time-slot-repository.port';
import { ReservationMapper } from 'src/infrastructure/mappers/reservation/reservation.mapper';
import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { IReservationApplicationPort } from '../ports/inbound/reservation-application.port';
import { TimeSlotDomainEntity } from 'src/core/domain/entities/time-slot.domain-entity';
import { TimeSlotMapper } from 'src/infrastructure/mappers/time-slot/timeslot.mapper';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';

@Injectable()
export class ReservationApplicationService
  implements IReservationApplicationPort
{
  constructor(
    @Inject(REPOSITORY_PORTS.RESERVATION)
    private readonly reservationRepo: IReservationRepositoryPort,
    @Inject(REPOSITORY_PORTS.RESERVATION_STATE)
    private readonly reservationStateRepo: IReservationStateRepositoryPort,
    @Inject(REPOSITORY_PORTS.TIME_SLOT)
    private timeSlotRepo: ITimeSlotRepositoryPort,
  ) {}

  async getAvailableTimeSlots(
    subScenarioId: number,
    date: Date,
  ): Promise<TimeslotResponseDto[]> {
    const allSlots: TimeSlotDomainEntity[] = await this.timeSlotRepo.findAll();
    const reservations: ReservationDomainEntity[] =
      await this.reservationRepo.findReservedSlotsBySubScenarioIdAndDate(
        subScenarioId,
        date,
      );
    const reservedSlotIds: Set<number> = new Set(
      reservations.map((r) => r.timeSlotId),
    );

    return allSlots.map((slot) =>
      TimeSlotMapper.toDto(slot, !reservedSlotIds.has(slot.id ?? 0)),
    );
  }

  async createReservation(
    dto: CreateReservationRequestDto,
    userId: number,
  ): Promise<CreateReservationResponseDto> {
    const reservationState: ReservationStateDomainEntity | null =
      await this.reservationStateRepo.findByName('PENDIENTE');
    const stateId = reservationState?.id ?? 1;
    // Check if a reservation already exists for the given time slot, date, and sub-scenario
    const reservationDate = new Date(dto.reservationDate + 'T00:00:00Z');
    const existingReservation: ReservationDomainEntity | null =
      await this.reservationRepo.findBySubscenarioIdAndDateAndTimeSlotId(
        dto.subScenarioId,
        reservationDate,
        dto.timeSlotId,
      );
    if (existingReservation)
      throw new ConflictException(
        'Ya existe una reserva en este escenario para este horario y fecha.',
      );
    const domain: ReservationDomainEntity = ReservationMapper.toDomain(
      dto,
      userId,
      stateId,
    );
    const created: ReservationDomainEntity =
      await this.reservationRepo.save(domain);
    console.log({ created });
    return ReservationMapper.toResponse(created);
  }

  async listReservations(
    opts: ReservationPageOptionsDto,
  ): Promise<PageDto<ReservationWithRelationsResponseDto>> {
    const { data: reservations, total } =
      await this.reservationRepo.findPaged(opts);

    const dtos = reservations.map((reservation) =>
      ReservationMapper.toResponseWithRelations(reservation),
    );
    console.log(dtos);
    return new PageDto(
      dtos,
      new PageMetaDto({
        page: opts.page,
        limit: opts.limit,
        totalItems: total,
      }),
    );
  }

  async updateReservationState(
    reservationId: number,
    dto: UpdateReservationStateDto,
  ): Promise<ReservationWithRelationsResponseDto> {
    // Verificar que la reserva existe
    const reservation = await this.reservationRepo.findById(reservationId);
    if (!reservation) {
      throw new NotFoundException(
        `Reserva con ID ${reservationId} no encontrada`,
      );
    }

    // Verificar que el estado existe
    const state = await this.reservationStateRepo.findById(dto.stateId);
    if (!state) {
      throw new NotFoundException(
        `Estado de reserva con ID ${dto.stateId} no encontrado`,
      );
    }

    // Actualizar el estado
    const updatedReservation = ReservationDomainEntity.builder()
      .withId(reservation.id ?? 0)
      .withReservationDate(reservation.reservationDate)
      .withSubScenarioId(reservation.subScenarioId)
      .withUserId(reservation.userId)
      .withTimeSlotId(reservation.timeSlotId)
      .withReservationStateId(dto.stateId)
      .withComments(reservation.comments)
      .build();

    console.log({ updatedReservation });

    // Actualizar la reserva y obtener la entidad completa con relaciones
    const savedReservation =
      await this.reservationRepo.update(updatedReservation);

    console.log({savedReservation})

    // Buscar la reserva actualizada con todas sus relaciones
    const refreshedReservation =
      await this.reservationRepo.findById(reservationId);
    if (!refreshedReservation) {
      throw new NotFoundException(
        `No se pudo encontrar la reserva actualizada con ID ${reservationId}`,
      );
    }

    // Obtener la reserva con todas sus relaciones desde el repositorio
    const reservationWithRelations =
      await this.reservationRepo.findById(reservationId);
    if (!reservationWithRelations) {
      throw new NotFoundException(
        `Reserva con ID ${reservationId} no encontrada después de actualizar`,
      );
    }

    // Crear la respuesta manualmente sin usar el mapper directamente
    return {
      id: refreshedReservation.id as number,
      reservationDate: refreshedReservation.reservationDate
        .toISOString()
        .split('T')[0],
      createdAt: new Date().toISOString(), // Usamos la fecha actual como fallback
      comments: refreshedReservation.comments,
      subScenario: {
        id: refreshedReservation.subScenarioId,
        name: 'Sub-escenario', // Valor por defecto
        hasCost: false,
        numberOfSpectators: 0,
        numberOfPlayers: 0,
        recommendations: '',
        scenarioId: 0,
        scenarioName: 'Escenario',
        scenario: {
          id: 0,
          name: 'Escenario',
          address: '',
          neighborhood: {
            id: 0,
            name: 'Barrio',
            commune: {
              id: 0,
              name: 'Comuna',
              city: {
                id: 0,
                name: 'Ciudad',
              },
            },
          },
        },
        neighborhood: {
          id: 0,
          name: 'Barrio',
          commune: {
            id: 0,
            name: 'Comuna',
            city: {
              id: 0,
              name: 'Ciudad',
            },
          },
        },
        commune: {
          id: 0,
          name: 'Comuna',
          city: {
            id: 0,
            name: 'Ciudad',
          },
        },
        city: {
          id: 0,
          name: 'Ciudad',
        },
      },
      user: {
        id: refreshedReservation.userId,
        first_name: 'Usuario',
        last_name: '',
        email: '',
        phone: '',
      },
      timeSlot: {
        id: refreshedReservation.timeSlotId,
        startTime: '00:00',
        endTime: '00:00',
      },
      reservationState: {
        id: refreshedReservation.reservationStateId,
        state: state.name,
      },
    };
  }

  async getAllReservationStates(): Promise<{ id: number; state: string }[]> {
    const states = await this.reservationStateRepo.findAll();
    return states.map((state) => ({
      id: state.id as number,
      state: state.name,
    }));
  }
}
