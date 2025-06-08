import { Injectable } from '@nestjs/common';

export interface TimeslotAvailability {
  timeslotId: number;
  isAvailable: boolean;
  conflictingReservationId?: number;
  conflictingUserId?: number;
}

export interface DateAvailability {
  date: string;
  dayOfWeek: number;
  availableTimeslotIds: number[];
  occupiedTimeslotIds: number[];
  timeslotAvailability: TimeslotAvailability[];
}

/**
 * Domain Service para verificar disponibilidad de timeslots
 */
@Injectable()
export class ReservationAvailabilityCheckerDomainService {
  /**
   * Método simplificado para obtener timeslots disponibles en una fecha
   */
  async getAvailableTimeSlotsForDate(
    subScenarioId: number,
    date: Date
  ): Promise<number[]> {
    // Por ahora retornamos un array con algunos IDs de timeslots
    // En una implementación completa, aquí consultaríamos el repositorio
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  /**
   * Obtiene disponibilidad de timeslots para una fecha específica
   */
  getAvailabilityForDate(
    date: Date,
    allTimeslotIds: number[],
    occupiedInstances: Array<{
      timeslotId: number;
      reservationId: number;
      userId: number;
      reservationStateId: number;
    }>
  ): DateAvailability {
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();

    // Filtrar solo instancias activas (PENDIENTE o CONFIRMADA)
    const activeOccupiedInstances = occupiedInstances.filter(
      instance => instance.reservationStateId === 1 || instance.reservationStateId === 2
    );

    const occupiedTimeslotIds = activeOccupiedInstances.map(instance => instance.timeslotId);
    const availableTimeslotIds = allTimeslotIds.filter(id => !occupiedTimeslotIds.includes(id));

    // Crear detalle de disponibilidad por timeslot
    const timeslotAvailability: TimeslotAvailability[] = allTimeslotIds.map(timeslotId => {
      const occupiedInstance = activeOccupiedInstances.find(instance => instance.timeslotId === timeslotId);
      
      return {
        timeslotId,
        isAvailable: !occupiedInstance,
        conflictingReservationId: occupiedInstance?.reservationId,
        conflictingUserId: occupiedInstance?.userId
      };
    });

    return {
      date: dateStr,
      dayOfWeek,
      availableTimeslotIds,
      occupiedTimeslotIds,
      timeslotAvailability
    };
  }

  /**
   * Obtiene disponibilidad para múltiples fechas
   */
  getAvailabilityForDateRange(
    dates: Date[],
    allTimeslotIds: number[],
    occupiedInstancesByDate: Map<string, Array<{
      timeslotId: number;
      reservationId: number;
      userId: number;
      reservationStateId: number;
    }>>
  ): DateAvailability[] {
    return dates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const occupiedInstances = occupiedInstancesByDate.get(dateStr) || [];
      
      return this.getAvailabilityForDate(date, allTimeslotIds, occupiedInstances);
    });
  }

  /**
   * Verifica si todos los timeslots están disponibles para todas las fechas
   */
  areAllTimeslotsAvailable(
    dates: Date[],
    timeslotIds: number[],
    occupiedInstancesByDate: Map<string, Array<{
      timeslotId: number;
      reservationStateId: number;
    }>>
  ): boolean {
    for (const date of dates) {
      const dateStr = date.toISOString().split('T')[0];
      const occupiedInstances = occupiedInstancesByDate.get(dateStr) || [];
      
      // Filtrar solo instancias activas
      const activeOccupiedTimeslots = occupiedInstances
        .filter(instance => instance.reservationStateId === 1 || instance.reservationStateId === 2)
        .map(instance => instance.timeslotId);

      // Verificar si algún timeslot requerido está ocupado
      const hasConflict = timeslotIds.some(timeslotId => 
        activeOccupiedTimeslots.includes(timeslotId)
      );

      if (hasConflict) {
        return false;
      }
    }

    return true;
  }

  /**
   * Encuentra el primer slot disponible en un rango de fechas
   */
  findFirstAvailableSlot(
    dates: Date[],
    timeslotIds: number[],
    occupiedInstancesByDate: Map<string, Array<{
      timeslotId: number;
      reservationStateId: number;
    }>>
  ): { date: Date; timeslotId: number } | null {
    for (const date of dates) {
      const dateStr = date.toISOString().split('T')[0];
      const occupiedInstances = occupiedInstancesByDate.get(dateStr) || [];
      
      const activeOccupiedTimeslots = occupiedInstances
        .filter(instance => instance.reservationStateId === 1 || instance.reservationStateId === 2)
        .map(instance => instance.timeslotId);

      for (const timeslotId of timeslotIds) {
        if (!activeOccupiedTimeslots.includes(timeslotId)) {
          return { date: new Date(date), timeslotId };
        }
      }
    }

    return null;
  }

  /**
   * Calcula estadísticas de disponibilidad
   */
  calculateAvailabilityStats(
    dateAvailabilities: DateAvailability[]
  ): {
    totalDates: number;
    totalTimeslots: number;
    totalSlots: number;
    availableSlots: number;
    occupiedSlots: number;
    availabilityPercentage: number;
    datesWithFullAvailability: number;
    datesWithNoAvailability: number;
  } {
    if (dateAvailabilities.length === 0) {
      return {
        totalDates: 0,
        totalTimeslots: 0,
        totalSlots: 0,
        availableSlots: 0,
        occupiedSlots: 0,
        availabilityPercentage: 0,
        datesWithFullAvailability: 0,
        datesWithNoAvailability: 0
      };
    }

    const totalDates = dateAvailabilities.length;
    const totalTimeslots = dateAvailabilities[0].timeslotAvailability.length;
    const totalSlots = totalDates * totalTimeslots;

    let availableSlots = 0;
    let datesWithFullAvailability = 0;
    let datesWithNoAvailability = 0;

    for (const dateAvailability of dateAvailabilities) {
      const availableCount = dateAvailability.availableTimeslotIds.length;
      availableSlots += availableCount;

      if (availableCount === totalTimeslots) {
        datesWithFullAvailability++;
      } else if (availableCount === 0) {
        datesWithNoAvailability++;
      }
    }

    const occupiedSlots = totalSlots - availableSlots;
    const availabilityPercentage = totalSlots > 0 ? (availableSlots / totalSlots) * 100 : 0;

    return {
      totalDates,
      totalTimeslots,
      totalSlots,
      availableSlots,
      occupiedSlots,
      availabilityPercentage: Math.round(availabilityPercentage * 100) / 100,
      datesWithFullAvailability,
      datesWithNoAvailability
    };
  }
}
