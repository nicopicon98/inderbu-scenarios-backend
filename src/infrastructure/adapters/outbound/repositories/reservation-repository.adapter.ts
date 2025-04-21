import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { IReservationRepositoryPort } from 'src/core/domain/ports/outbound/reservation-repository.port';
import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { ReservationEntity } from 'src/infrastructure/persistence/reservation.entity';
import { MYSQL_REPOSITORY } from 'src/infrastructure/tokens/repositories';
import { BaseRepositoryAdapter } from './common/base-repository.adapter';


@Injectable()
export class ReservationRepositoryAdapter
  extends BaseRepositoryAdapter<ReservationEntity, ReservationDomainEntity>
  implements IReservationRepositoryPort
{
  constructor(
    @Inject(MYSQL_REPOSITORY.RESERVATION)
    repository: Repository<ReservationEntity>,
  ) {
    super(repository);
  }

  protected toEntity(domain: ReservationDomainEntity): ReservationEntity {
    return this.repository.create({
      reservationDate: domain.reservationDate,
      subScenario: { id: domain.subScenarioId },
      user: { id: domain.userId },
      timeSlot: { id: domain.timeSlotId },
      reservationState: { id: domain.reservationStateId },
    });
  }

  protected toDomain(entity: ReservationEntity): ReservationDomainEntity {
    return ReservationDomainEntity.builder()
      .withId(entity.id)
      .withReservationDate(entity.reservationDate)
      .withSubScenarioId(entity.subScenario.id)
      .withUserId(entity.user.id)
      .withTimeSlotId(entity.timeSlot.id)
      .withReservationStateId(entity.reservationState.id)
      .build();
  }

  async findBySubscenarioIdAndDateAndTimeSlotId(
    subscenarioId: number,
    date: Date,
    timeSlotId: number,
  ): Promise<ReservationDomainEntity | null> {
    console.log({ subscenarioId, date, timeSlotId });
    const reservation = await this.repository.findOne({
      where: {
        subScenario: { id: subscenarioId },
        reservationDate: date,
        timeSlot: { id: timeSlotId },
      },
      relations: ['timeSlot', 'reservationState'],
    });

    return reservation ? this.toDomain(reservation) : null;
  }

  async findReservedSlotsBySubScenarioIdAndDate(
    subScenarioId: number,
    date: Date,
  ): Promise<ReservationDomainEntity[]> {
    console.log({date});
    const reservations = await this.repository.find({
      where: {
        subScenario: { id: subScenarioId },
        reservationDate: date,
        reservationState: { state: In(['PENDIENTE', 'CONFIRMADA']) },
      },
      relations: ['timeSlot', 'reservationState'],
    });

    return reservations.map(this.toDomain);
  }
}
