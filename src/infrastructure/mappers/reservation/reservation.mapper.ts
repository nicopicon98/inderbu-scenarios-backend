import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { CreateReservationRequestDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { CreateReservationResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-response.dto';

export class ReservationMapper {
  static toResponse(
    domain: ReservationDomainEntity
  ): CreateReservationResponseDto {
    return {
      id: domain.id!,
      reservationDate: domain.reservationDate.toISOString().split('T')[0],
      subScenarioId: domain.subScenarioId,
      userId: domain.userId,
      timeSlotId: domain.timeSlotId,
      reservationStateId: domain.reservationStateId,
    };
  }

  static toDomain(
    dto: CreateReservationRequestDto,
    userId: number,
    reservationStateId: number = 1 // PENDING_STATE_ID
  ): ReservationDomainEntity {
    return ReservationDomainEntity.builder()
      .withSubScenarioId(dto.subScenarioId)
      .withUserId(userId)
      .withTimeSlotId(dto.timeSlotId)
      .withReservationDate(new Date(dto.reservationDate + 'T00:00:00Z'))
      .withReservationStateId(reservationStateId)
      .build();
  }
}