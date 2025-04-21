import { CreateReservationRequestDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-request.dto';
import { CreateReservationResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/reservation/create-reservation-response.dto';
import { TimeslotResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/time-slot/timeslot-response.dto';

export interface IReservationApplicationPort {
  getAvailableTimeSlots(
    subScenarioId: number,
    date: Date,
  ): Promise<TimeslotResponseDto[]>;

  createReservation(
    dto: CreateReservationRequestDto,
    userId: number
  ): Promise<CreateReservationResponseDto>;
}
