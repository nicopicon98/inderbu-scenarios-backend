import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { ReservationPageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/reservation-page-options.dto';
import { ReservationEntity } from 'src/infrastructure/persistence/reservation.entity';

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
  findById(id: number): Promise<ReservationDomainEntity | null>;
  update(reservation: ReservationDomainEntity): Promise<ReservationDomainEntity>;
  findPaged(opts: ReservationPageOptionsDto): Promise<{ data: ReservationEntity[]; total: number }>;
}
