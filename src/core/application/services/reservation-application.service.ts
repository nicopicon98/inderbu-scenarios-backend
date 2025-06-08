import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { IReservationApplicationPort } from '../ports/inbound/reservation-application.port';
import { CreateReservationRequestDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { CreateReservationResponseDto, ReservationWithDetailsResponseDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/reservation.dto';
import { AvailableTimeslotsQueryDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/available-timeslots-query.dto';
import { AvailabilityResponseDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/availability.dto';
import { ReservationPageOptionsDto } from '../../../infrastructure/adapters/inbound/http/dtos/reservation/reservation-page-options.dto';
import { PageDto, PageMetaDto } from '../../../infrastructure/adapters/inbound/http/dtos/common/page.dto';

import { ReservationDomainEntity, ReservationType } from '../../domain/entities/reservation.domain-entity';
import { ReservationTimeslotDomainEntity } from '../../domain/entities/reservation-timeslot.domain-entity';
import { ReservationInstanceDomainEntity } from '../../domain/entities/reservation-instance.domain-entity';

import { IReservationRepositoryPort } from '../../domain/ports/outbound/reservation-repository.port';
import { IReservationTimeslotRepositoryPort } from '../../domain/ports/outbound/reservation-timeslot-repository.port';
import { IReservationInstanceRepositoryPort } from '../../domain/ports/outbound/reservation-instance-repository.port';

import { ReservationDateCalculatorDomainService } from '../../domain/services/reservation-date-calculator.domain-service';
import { ReservationConflictDetectorDomainService } from '../../domain/services/reservation-conflict-detector.domain-service';
import { ReservationInstanceGeneratorDomainService } from '../../domain/services/reservation-instance-generator.domain-service';
import { ReservationAvailabilityCheckerDomainService } from '../../domain/services/reservation-availability-checker.domain-service';

import { REPOSITORY_PORTS } from '../../../infrastructure/tokens/ports';
import { DOMAIN_SERVICES } from '../tokens/ports';

@Injectable()
export class ReservationApplicationService implements IReservationApplicationPort {
  constructor(
    @Inject(REPOSITORY_PORTS.RESERVATION)
    private readonly reservationRepo: IReservationRepositoryPort,
    
    @Inject(REPOSITORY_PORTS.RESERVATION_TIMESLOT)
    private readonly timeslotRepo: IReservationTimeslotRepositoryPort,
    
    @Inject(REPOSITORY_PORTS.RESERVATION_INSTANCE)
    private readonly instanceRepo: IReservationInstanceRepositoryPort,
    
    @Inject(DOMAIN_SERVICES.RESERVATION_DATE_CALCULATOR)
    private readonly dateCalculator: ReservationDateCalculatorDomainService,
    
    @Inject(DOMAIN_SERVICES.RESERVATION_CONFLICT_DETECTOR)
    private readonly conflictDetector: ReservationConflictDetectorDomainService,
    
    @Inject(DOMAIN_SERVICES.RESERVATION_INSTANCE_GENERATOR)
    private readonly instanceGenerator: ReservationInstanceGeneratorDomainService,
    
    @Inject(DOMAIN_SERVICES.RESERVATION_AVAILABILITY_CHECKER)
    private readonly availabilityChecker: ReservationAvailabilityCheckerDomainService,
  ) {}

  async createReservation(
    dto: CreateReservationRequestDto,
    userId: number,
  ): Promise<CreateReservationResponseDto> {
    console.log('🎯 Creating reservation', { dto, userId });

    // 1. Determinar tipo de reserva
    let type: ReservationType;
    let initialDate: Date;
    let finalDate: Date | undefined = undefined;
    let weekDays: number[] | undefined = undefined;

    if (dto.reservationRange) {
      type = ReservationType.RANGE;
      initialDate = new Date(dto.reservationRange.initialDate + 'T00:00:00Z');
      finalDate = new Date(dto.reservationRange.finalDate + 'T00:00:00Z');
      weekDays = dto.weekdays || [];
    } else if (dto.singleDate) {
      type = ReservationType.SINGLE;
      initialDate = new Date(dto.singleDate + 'T00:00:00Z');
    } else {
      // Default to today
      type = ReservationType.SINGLE;
      initialDate = new Date();
      initialDate.setHours(0, 0, 0, 0);
    }

    // 2. Calcular fechas usando domain service
    const calculatedDates = this.dateCalculator.calculateDatesForReservation(
      type,
      initialDate,
      finalDate,
      weekDays
    );

    // 3. Detectar conflictos usando domain service
    const conflicts = await this.conflictDetector.detectConflictsForNewReservation(
      dto.subScenarioId,
      dto.timeSlotIds,
      calculatedDates
    );

    if (conflicts.length > 0) {
      throw new ConflictException('Time slot conflicts detected');
    }

    // 4. Crear reserva principal
    const reservation = ReservationDomainEntity.builder()
      .withSubScenarioId(dto.subScenarioId)
      .withUserId(userId)
      .withType(type)
      .withInitialDate(initialDate)
      .withFinalDate(finalDate)
      .withWeekDays(weekDays)
      .withComments(dto.comments)
      .withReservationStateId(1) // PENDIENTE
      .build();

    const savedReservation = await this.reservationRepo.save(reservation);

    // 5. Crear relaciones con timeslots
    const timeslotEntities = dto.timeSlotIds.map(timeSlotId => 
      ReservationTimeslotDomainEntity.builder()
        .withReservationId(savedReservation.id!)
        .withTimeslotId(timeSlotId)
        .build()
    );
    await this.timeslotRepo.saveMany(timeslotEntities);

    // 6. Generar instancias usando domain service
    const instancesData = this.instanceGenerator.generateInstances(
      savedReservation.id!,
      dto.subScenarioId,
      userId,
      1, // PENDIENTE
      dto.timeSlotIds,
      calculatedDates
    );

    // 7. Guardar instancias
    await this.instanceRepo.saveMany(instancesData as ReservationInstanceDomainEntity[]);

    // 8. Preparar respuesta
    return {
      id: savedReservation.id!,
      subScenarioId: dto.subScenarioId,
      userId,
      type: type.toString(),
      initialDate: initialDate.toISOString().split('T')[0],
      finalDate: finalDate?.toISOString().split('T')[0] || null,
      weekDays: weekDays || null,
      comments: dto.comments || null,
      reservationStateId: 1,
      timeslots: [], // Se llenará con datos reales
      instances: [], // Se llenará con datos reales
      totalInstances: calculatedDates.length * dto.timeSlotIds.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getAvailableTimeSlots(
    query: AvailableTimeslotsQueryDto,
  ): Promise<AvailabilityResponseDto> {
    const date = new Date(query.date + 'T00:00:00Z');
    
    // Obtener todos los timeslots disponibles usando domain service
    const availableTimeslotIds = await this.availabilityChecker.getAvailableTimeSlotsForDate(
      query.subScenarioId,
      date
    );

    return {
      subScenarioId: query.subScenarioId,
      date: query.date,
      timeslots: availableTimeslotIds.map(id => ({
        id,
        startTime: `${String(id).padStart(2, '0')}:00:00`,
        endTime: `${String(id).padStart(2, '0')}:59:59`,
        isAvailable: true
      })),
      totalAvailable: availableTimeslotIds.length,
      totalTimeslots: 18, // Total de timeslots en el día
      queriedAt: new Date().toISOString(),
    };
  }

  async listReservations(
    options: ReservationPageOptionsDto,
  ): Promise<PageDto<ReservationWithDetailsResponseDto>> {
    const { data, total } = await this.reservationRepo.findPaged(options);

    const dtos: ReservationWithDetailsResponseDto[] = data.map(reservation => ({
      id: reservation.id!,
      type: reservation.type.toString(),
      subScenarioId: reservation.subScenarioId,
      userId: reservation.userId,
      initialDate: reservation.initialDate.toISOString().split('T')[0],
      finalDate: reservation.finalDate?.toISOString().split('T')[0] || null,
      weekDays: reservation.weekDays || null,
      comments: reservation.comments || null,
      reservationStateId: reservation.reservationStateId,
      subScenario: { id: reservation.subScenarioId, name: 'Unknown' },
      user: { id: reservation.userId, firstName: 'Unknown', lastName: 'User', email: 'unknown@email.com' },
      reservationState: { id: reservation.reservationStateId, name: 'PENDIENTE', description: 'Pending state' },
      timeslots: [],
      totalInstances: 0,
      createdAt: reservation.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: reservation.updatedAt?.toISOString() || new Date().toISOString(),
    }));

    const meta = new PageMetaDto({
      page: options.page || 1,
      limit: options.limit || 20,
      totalItems: total,
    });

    return new PageDto(dtos, meta);
  }

  async getReservationById(id: number): Promise<ReservationWithDetailsResponseDto> {
    const reservation = await this.reservationRepo.findById(id);
    
    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${id} not found`);
    }

    return {
      id: reservation.id!,
      type: reservation.type.toString(),
      subScenarioId: reservation.subScenarioId,
      userId: reservation.userId,
      initialDate: reservation.initialDate.toISOString().split('T')[0],
      finalDate: reservation.finalDate?.toISOString().split('T')[0] || null,
      weekDays: reservation.weekDays || null,
      comments: reservation.comments || null,
      reservationStateId: reservation.reservationStateId,
      subScenario: { id: reservation.subScenarioId, name: 'Unknown' },
      user: { id: reservation.userId, firstName: 'Unknown', lastName: 'User', email: 'unknown@email.com' },
      reservationState: { id: reservation.reservationStateId, name: 'PENDIENTE', description: 'Pending state' },
      timeslots: [],
      totalInstances: 0,
      createdAt: reservation.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: reservation.updatedAt?.toISOString() || new Date().toISOString(),
    };
  }

  async updateReservationState(
    reservationId: number,
    dto: { stateId: number; comments?: string },
  ): Promise<ReservationWithDetailsResponseDto> {
    const updatedReservation = await this.reservationRepo.updateState(reservationId, dto.stateId);
    
    // También actualizar las instancias
    await this.instanceRepo.updateStateByReservationId(reservationId, dto.stateId);

    return this.getReservationById(reservationId);
  }

  async cancelReservation(reservationId: number): Promise<ReservationWithDetailsResponseDto> {
    return this.updateReservationState(reservationId, { stateId: 3 }); // CANCELADA
  }

  async confirmReservation(reservationId: number): Promise<ReservationWithDetailsResponseDto> {
    return this.updateReservationState(reservationId, { stateId: 2 }); // CONFIRMADA
  }

  async getAllReservationStates(): Promise<{ id: number; state: string }[]> {
    // Implementación básica
    return [
      { id: 1, state: 'PENDIENTE' },
      { id: 2, state: 'CONFIRMADA' },
      { id: 3, state: 'CANCELADA' }
    ];
  }

  async getReservationStats(): Promise<{
    totalReservations: number;
    totalInstances: number;
    reservationsByState: Record<string, number>;
    reservationsByType: Record<string, number>;
  }> {
    // Implementación básica
    return {
      totalReservations: 0,
      totalInstances: 0,
      reservationsByState: {},
      reservationsByType: {},
    };
  }
}
