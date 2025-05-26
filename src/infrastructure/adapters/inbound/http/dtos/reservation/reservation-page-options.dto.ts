
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min, IsDateString } from 'class-validator';

export class ReservationPageOptionsDto {
  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @Type(() => Number)          
  @IsInt()
  @Min(1)
  page = 1;                   

  @ApiPropertyOptional({ minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional() @IsOptional() @Type(() => Number) scenarioId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) activityAreaId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) neighborhoodId?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) userId?: number;

  // ⭐ FILTROS ESPECÍFICOS PARA RESERVATIONS
  @ApiPropertyOptional({ description: 'Fecha inicial del rango (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Fecha final del rango (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
