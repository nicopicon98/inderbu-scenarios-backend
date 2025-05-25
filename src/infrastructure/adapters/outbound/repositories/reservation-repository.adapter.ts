import { Inject, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';

import { IReservationRepositoryPort } from 'src/core/domain/ports/outbound/reservation-repository.port';
import { ReservationDomainEntity } from 'src/core/domain/entities/reservation.domain-entity';
import { ReservationEntity } from 'src/infrastructure/persistence/reservation.entity';
import { PageOptionsDto } from '../../inbound/http/dtos/common/page-options.dto';
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
      comments: domain.comments || null,
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
      .withComments(entity.comments || undefined)
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

  async findById(id: number): Promise<ReservationDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: [
        'subScenario',
        'subScenario.scenario',
        'subScenario.scenario.neighborhood',
        'subScenario.scenario.neighborhood.commune',
        'subScenario.scenario.neighborhood.commune.city',
        'user',
        'timeSlot',
        'reservationState',
      ],
    });

    return entity ? this.toDomain(entity) : null;
  }

  async findPaged(opts: PageOptionsDto): Promise<{ data: ReservationEntity[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      search,
      scenarioId,
      activityAreaId,
      neighborhoodId,
      userId,
    } = opts;

    try {
      // Crear un QueryBuilder para obtener todos los datos con sus relaciones
      const qb = this.repository.createQueryBuilder('r')
        .leftJoinAndSelect('r.subScenario', 'ss')
        .leftJoinAndSelect('ss.scenario', 'sc')
        .leftJoinAndSelect('sc.neighborhood', 'n')
        .leftJoinAndSelect('n.commune', 'com')
        .leftJoinAndSelect('com.city', 'city')
        .leftJoinAndSelect('r.user', 'u')
        .leftJoinAndSelect('r.timeSlot', 'ts')
        .leftJoinAndSelect('r.reservationState', 'rs');

      // Aplicar filtros si están presentes
      if (scenarioId) qb.andWhere('sc.id = :scenarioId', { scenarioId });
      if (activityAreaId) qb.andWhere('ss.fk_activity_area_id = :activityAreaId', { activityAreaId });
      if (neighborhoodId) qb.andWhere('n.id = :neighborhoodId', { neighborhoodId });
      if (userId) qb.andWhere('u.id = :userId', { userId });

      // Búsqueda por texto si está presente
      if (search?.trim()) {
        const term = search.trim();
        qb.andWhere(
          '(u.first_name LIKE :search OR u.last_name LIKE :search OR sc.name LIKE :search OR ss.name LIKE :search OR n.name LIKE :search OR com.name LIKE :search OR city.name LIKE :search)',
          { search: `%${term}%` }
        );
      }

      // Ordenación y paginación
      qb.orderBy('r.reservationDate', 'DESC')
        .addOrderBy('ts.startTime', 'ASC')
        .skip((page - 1) * limit)
        .take(limit);

      // Obtener datos y total
      const [entities, total] = await qb.getManyAndCount();

      return { data: entities, total };
    } catch (error) {
      console.error('Error en findPaged:', error);
      throw error;
    }
  }

  async update(reservation: ReservationDomainEntity): Promise<ReservationDomainEntity> {
    // Obtenemos la entidad existente para asegurarnos de actualizar solo los campos que nos interesan
    const existingEntity = await this.repository.findOne({
      where: { id: reservation.id as number },
      relations: [
        'subScenario',
        'user',
        'timeSlot',
        'reservationState',
      ],
    });

    if (!existingEntity) {
      throw new Error(`Reserva con ID ${reservation.id} no encontrada`);
    }

    // Actualizamos solo los campos que nos interesan (el estado en este caso)
    existingEntity.reservationState = { id: reservation.reservationStateId } as any;
    
    // Si hay comentarios, los actualizamos
    if (reservation.comments !== undefined) {
      existingEntity.comments = reservation.comments;
    }

    // Guardamos la entidad actualizada
    const updated = await this.repository.save(existingEntity);

    // Recargamos la entidad con todas sus relaciones para devolverla completa
    const reloaded = await this.repository.findOne({
      where: { id: updated.id },
      relations: [
        'subScenario',
        'subScenario.scenario',
        'subScenario.scenario.neighborhood',
        'subScenario.scenario.neighborhood.commune',
        'subScenario.scenario.neighborhood.commune.city',
        'user',
        'timeSlot',
        'reservationState',
      ],
    });

    return this.toDomain(reloaded!);
  }
}
