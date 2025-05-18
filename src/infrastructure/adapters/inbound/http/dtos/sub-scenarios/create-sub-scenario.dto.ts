import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CreateSubScenarioDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  state?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  hasCost?: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfSpectators?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  numberOfPlayers?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  recommendations?: string;

  @ApiProperty()
  @IsInt()
  scenarioId: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  activityAreaId?: number;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  fieldSurfaceTypeId?: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, required: false })
  @IsOptional()
  images?: any[];
}
