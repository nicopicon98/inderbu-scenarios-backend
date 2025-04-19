import { ApiProperty } from '@nestjs/swagger';
import { SubScenarioResponseDto } from './sub-scenario-response.dto';

export class NamedRefDto {
  @ApiProperty() id!: number;
  @ApiProperty() name!: string;
}

export class NamedRefWithAddressDto extends NamedRefDto {
  @ApiProperty() address!: string;
}

export class SubScenarioWithRelationsDto extends SubScenarioResponseDto {
  @ApiProperty({ type: () => NamedRefDto })
  scenario?: NamedRefWithAddressDto;

  @ApiProperty({ required: false, type: () => NamedRefDto })
  activityArea?: NamedRefDto;

  @ApiProperty({ required: false, type: () => NamedRefDto })
  fieldSurfaceType?: NamedRefDto;
}
