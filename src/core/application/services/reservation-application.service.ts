import { ConflictException, Inject, Injectable } from '@nestjs/common';

import { CreateReservationResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-response.dto';
import { CreateReservationRequestDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { TimeslotResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/time-slot/timeslot-response.dto';
import { IReservationStateRepositoryPort } from 'src/core/domain/ports/outbound/reservation-state-repository.port';
import { IReservationRepositoryPort } from 'src/core/domain/ports/outbound/reservation-repository.port';
import { ReservationStateDomainEntity } from 'src/core/domain/entities/reservation-state.domain-entity';
import { ITimeSlotRepositoryPort } from 'src/core/domain/ports/outbound/time-slot-repository.port';
import { ReservationMapper } from 'src/infrastructure/mappers/reservation/reservation.mapper';
import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { IReservationApplicationPort } from '../ports/inbound/reservation-application.port';
import { TimeSlotDomainEntity } from 'src/core/domain/entities/time-slot.domain-entity';
import { TimeSlotMapper } from 'src/infrastructure/mappers/time-slot/timeslot.mapper';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
import { PageDto, PageMetaDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page.dto';
import { ReservationWithRelationsResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/reservation-with-relations-response.dto';

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
    console.log({created});
    return ReservationMapper.toResponse(created);
  }

  async listReservations(opts: PageOptionsDto): Promise<PageDto<ReservationWithRelationsResponseDto>> {
    const { data: reservations, total } = await this.reservationRepo.findPaged(opts);
    
    const dtos = reservations.map(reservation => ReservationMapper.toResponseWithRelations(reservation));
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
}
