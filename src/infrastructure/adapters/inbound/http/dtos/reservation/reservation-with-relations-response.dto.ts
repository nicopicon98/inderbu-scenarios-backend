import { ApiProperty } from '@nestjs/swagger';

class CityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  code?: string;
}

class CommuneDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ type: CityDto })
  city: CityDto;
}

class NeighborhoodDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ type: CommuneDto })
  commune: CommuneDto;
}

class ScenarioDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty({ required: false })
  active?: boolean;

  @ApiProperty({ type: NeighborhoodDto })
  neighborhood: NeighborhoodDto;
}

class SubScenarioDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  hasCost?: boolean;

  @ApiProperty({ required: false })
  numberOfSpectators?: number;

  @ApiProperty({ required: false })
  numberOfPlayers?: number;

  @ApiProperty({ required: false })
  recommendations?: string;

  // Mantener estos campos para compatibilidad
  @ApiProperty()
  scenarioId: number;

  @ApiProperty()
  scenarioName: string;

  // Añadir objeto completo de escenario
  @ApiProperty({ type: ScenarioDto })
  scenario: ScenarioDto;

  // Añadir objetos para referencias directas a niveles superiores para facilitar el acceso
  @ApiProperty({ type: NeighborhoodDto })
  neighborhood: NeighborhoodDto;

  @ApiProperty({ type: CommuneDto })
  commune: CommuneDto;

  @ApiProperty({ type: CityDto })
  city: CityDto;
}

class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  first_name: string;

  @ApiProperty()
  last_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
}

class TimeSlotDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;
}

class ReservationStateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  state: string;
}

export class ReservationWithRelationsResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: '2025-04-20' })
  reservationDate: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ type: SubScenarioDto })
  subScenario: SubScenarioDto;

  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TimeSlotDto })
  timeSlot: TimeSlotDto;

  @ApiProperty({ type: ReservationStateDto })
  reservationState: ReservationStateDto;
}
