import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';

export interface IReservationRepositoryPort {
  findReservedSlotsBySubScenarioIdAndDate(
    subScenarioId: number,
    date: Date,
  ): Promise<ReservationDomainEntity[]>;
  findBySubscenarioIdAndDateAndTimeSlotId(
    id: number,
    date: Date,
    timeSlotId: number,
  ): Promise<ReservationDomainEntity | null>
  save(reservation: ReservationDomainEntity): Promise<ReservationDomainEntity>;
}
