import { ApiProperty } from '@nestjs/swagger';

export class SubScenarioImageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  path: string;
  
  @ApiProperty()
  isFeature: boolean;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty({ description: 'Id del sub-escenario al que pertenece' })
  subScenarioId: number;
  
  @ApiProperty({ required: false })
  createdAt?: Date;
}
