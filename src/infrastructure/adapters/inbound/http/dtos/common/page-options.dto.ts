import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PageOptionsDto {
  @IsOptional()
  @Type(() => Number)          // ← transforma '2'  ->  2   y '{}' -> NaN
  @IsInt()
  @Min(1)
  page = 1;                    // default si viene undefined o NaN

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 20;

  @IsOptional()
  search?: string;

  @IsOptional() @Type(() => Number) scenarioId?: number;
  @IsOptional() @Type(() => Number) activityAreaId?: number;
}
