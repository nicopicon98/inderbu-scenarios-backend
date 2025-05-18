import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { PageOptionsDto } from 'src/infrastructure/adapters/inbound/http/dtos/common/page-options.dto';
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
  findPaged(opts: PageOptionsDto): Promise<{ data: ReservationEntity[]; total: number }>;
}
