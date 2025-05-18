import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { CreateReservationRequestDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { CreateReservationResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-response.dto';
import { ReservationWithRelationsResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/reservation-with-relations-response.dto';
import { ReservationEntity } from 'src/infrastructure/persistence/reservation.entity';

export class ReservationMapper {
  static toResponse(domain: ReservationDomainEntity): CreateReservationResponseDto {
    return {
      id: domain.id!,
      reservationDate: domain.reservationDate.toISOString().split('T')[0],
      subScenarioId: domain.subScenarioId,
      userId: domain.userId,
      timeSlotId: domain.timeSlotId,
      reservationStateId: domain.reservationStateId,
    };
  }

  static toResponseWithRelations(entity: ReservationEntity): ReservationWithRelationsResponseDto {
    // Extraer referencias para legibilidad
    const subScenario = entity.subScenario;
    const scenario = subScenario?.scenario || {} as any;
    const neighborhood = scenario?.neighborhood || {} as any;
    const commune = neighborhood?.commune || {} as any;
    const city = commune?.city || {} as any;

    // Crear el objeto de respuesta con todas las relaciones
    return {
      id: entity.id,
      reservationDate: entity.reservationDate.toISOString().split('T')[0],
      createdAt: entity.createdAt.toISOString(),
      subScenario: {
        id: subScenario.id,
        name: subScenario.name,
        hasCost: subScenario.hasCost ?? false,
        numberOfSpectators: subScenario.numberOfSpectators ?? 0,
        numberOfPlayers: subScenario.numberOfPlayers ?? 0,
        recommendations: subScenario.recommendations ?? '',
        
        // Campos para compatibilidad
        scenarioId: scenario.id ?? 0,
        scenarioName: scenario.name ?? 'Sin escenario',
        
        // Nuevos objetos completos
        scenario: {
          id: scenario.id ?? 0,
          name: scenario.name ?? 'Sin escenario',
          address: scenario.address ?? '',
          neighborhood: {
            id: neighborhood.id ?? 0,
            name: neighborhood.name ?? 'Sin barrio',
            commune: {
              id: commune.id ?? 0,
              name: commune.name ?? 'Sin comuna',
              city: {
                id: city.id ?? 0,
                name: city.name ?? 'Sin ciudad',
              }
            }
          }
        },
        
        // Referencias directas para facilitar acceso
        neighborhood: {
          id: neighborhood.id ?? 0,
          name: neighborhood.name ?? 'Sin barrio',
          commune: {
            id: commune.id ?? 0,
            name: commune.name ?? 'Sin comuna',
            city: {
              id: city.id ?? 0,
              name: city.name ?? 'Sin ciudad',
            }
          }
        },
        commune: {
          id: commune.id ?? 0,
          name: commune.name ?? 'Sin comuna',
          city: {
            id: city.id ?? 0,
            name: city.name ?? 'Sin ciudad',
          }
        },
        city: {
          id: city.id ?? 0,
          name: city.name ?? 'Sin ciudad',
        }
      },
      user: {
        id: entity.user.id,
        first_name: entity.user.first_name ?? '',
        last_name: entity.user.last_name ?? '',
        email: entity.user.email ?? '',
        phone: entity.user.phone ?? '',
      },
      timeSlot: {
        id: entity.timeSlot.id,
        startTime: entity.timeSlot.startTime,
        endTime: entity.timeSlot.endTime,
      },
      reservationState: {
        id: entity.reservationState.id,
        state: entity.reservationState.state,
      },
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