import { ApiProperty } from '@nestjs/swagger';
import { SubScenarioResponseDto } from './sub-scenario-response.dto';
import { SubScenarioImageResponseDto } from '../images/image-response.dto';

export class NamedRefDto {
  @ApiProperty() id!: number;
  @ApiProperty() name!: string;
}

export class NamedRefWithAddressDto extends NamedRefDto {
  @ApiProperty() address!: string;
}

export class NamedRefWithNeighborhoodDto extends NamedRefWithAddressDto {
  @ApiProperty({ type: () => NamedRefDto })
  neighborhood!: NamedRefDto;
}

export class SubScenarioWithRelationsDto extends SubScenarioResponseDto {
  @ApiProperty({ type: () => NamedRefWithNeighborhoodDto })
  scenario!:   NamedRefWithNeighborhoodDto;

  @ApiProperty({ required: false, type: () => NamedRefDto })
  activityArea?: NamedRefDto;

  @ApiProperty({ required: false, type: () => NamedRefDto })
  fieldSurfaceType?: NamedRefDto;

  @ApiProperty({ type: [SubScenarioImageResponseDto], required: false })
  images?: SubScenarioImageResponseDto[];
}
