import { 
  IsDefined,
  IsNotEmpty, 
  IsNumber, 
  IsPositive,
  IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AvailableTimeslotsQueryDto {
  @ApiProperty({ 
    example: 16, 
    description: 'ID del sub-escenario' 
  })
  @IsDefined()
  @IsNumber()
  @IsPositive()
  readonly subScenarioId: number;

  @ApiProperty({ 
    example: '2025-06-09', 
    description: 'Fecha para consultar disponibilidad (YYYY-MM-DD)' 
  })
  @IsDefined()
  @IsDateString()
  @IsNotEmpty()
  readonly date: string;
}
