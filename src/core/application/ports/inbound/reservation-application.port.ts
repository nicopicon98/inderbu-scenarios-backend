import { CreateReservationRequestDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { CreateReservationResponseDto, ReservationWithDetailsResponseDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/reservation.dto';
import { AvailableTimeslotsQueryDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/available-timeslots-query.dto';
import { AvailabilityResponseDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/availability.dto';
import { ReservationPageOptionsDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/reservation-page-options.dto';
import { PageDto } from '../../../infrastructure/adapters/inbound/http/dtos/common/page.dto';

export interface UpdateReservationStateDto {
  stateId: number;
  comments?: string;
}

export interface IReservationApplicationPort {
  /**
   * Crea una nueva reserva (simple o compleja)
   */
  createReservation(
    dto: CreateReservationRequestDto,
    userId: number,
  ): Promise<CreateReservationResponseDto>;

  /**
   * Obtiene disponibilidad de timeslots
   */
  getAvailableTimeSlots(
    query: AvailableTimeslotsQueryDto,
  ): Promise<AvailabilityResponseDto>;

  /**
   * Lista reservas con filtros y paginación
   */
  listReservations(
    options: ReservationPageOptionsDto,
  ): Promise<PageDto<ReservationWithDetailsResponseDto>>;

  /**
   * Obtiene una reserva por ID
   */
  getReservationById(id: number): Promise<ReservationWithDetailsResponseDto>;

  /**
   * Actualiza el estado de una reserva
   */
  updateReservationState(
    reservationId: number,
    dto: UpdateReservationStateDto,
  ): Promise<ReservationWithDetailsResponseDto>;

  /**
   * Cancela una reserva
   */
  cancelReservation(reservationId: number): Promise<ReservationWithDetailsResponseDto>;

  /**
   * Confirma una reserva
   */
  confirmReservation(reservationId: number): Promise<ReservationWithDetailsResponseDto>;

  /**
   * Obtiene todos los estados de reserva disponibles
   */
  getAllReservationStates(): Promise<{ id: number; state: string }[]>;

  /**
   * Obtiene estadísticas de reservas
   */
  getReservationStats(): Promise<{
    totalReservations: number;
    totalInstances: number;
    reservationsByState: Record<string, number>;
    reservationsByType: Record<string, number>;
  }>;
}
