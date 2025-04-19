import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Inject } from '@nestjs/common';

import { NeighborhoodResponseMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-response.mapper';
import { INeighborhoodApplicationPort } from 'src/core/application/ports/inbound/neighborhood-application.port';
import { NeighborhoodResponseDto } from '../dtos/neighborhood/neighborhood-response.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';

@Controller('neighborhoods')
export class NeighborhoodController {
  constructor(
    @Inject(APPLICATION_PORTS.NEIGHBORHOOD)
    private readonly service: INeighborhoodApplicationPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista de barrios' })
  @ApiResponse({ status: 200, type: [NeighborhoodResponseDto] })
  async list(): Promise<NeighborhoodResponseDto[]> {
    const list: NeighborhoodDomainEntity[] = await this.service.listAll();
    return list.map(NeighborhoodResponseMapper.toDto);
  }
}
