import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { INeighborhoodApplicationPort } from 'src/core/application/ports/inbound/neighborhood-application.port';
import { NeighborhoodResponseDto } from '../dtos/neighborhood/neighborhood-response.dto';
import { NeighborhoodResponseMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-response.mapper';

@Controller('neighborhoods')
export class NeighborhoodController {
  constructor(
    @Inject('INeighborhoodApplicationPort')
    private readonly service: INeighborhoodApplicationPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista de barrios' })
  @ApiResponse({ status: 200, type: [NeighborhoodResponseDto] })
  async list(): Promise<NeighborhoodResponseDto[]> {
    const list = await this.service.listAll();
    return list.map(NeighborhoodResponseMapper.toDto);
  }
}
