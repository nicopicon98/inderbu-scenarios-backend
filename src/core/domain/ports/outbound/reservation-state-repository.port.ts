import { ReservationStateDomainEntity } from "../../entities/reservation-state.domain-entity";

export interface IReservationStateRepositoryPort {
  /**
   * Busca un estado de reserva por su nombre.
   */
  findByName(name: string): Promise<ReservationStateDomainEntity | null>;
}