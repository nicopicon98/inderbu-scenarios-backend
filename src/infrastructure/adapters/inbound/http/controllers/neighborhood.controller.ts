import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Controller, Get, Inject, Query } from '@nestjs/common';

import { NeighborhoodResponseMapper } from 'src/infrastructure/mappers/neighborhood/neighborhood-response.mapper';
import { INeighborhoodApplicationPort } from 'src/core/application/ports/inbound/neighborhood-application.port';
import { NeighborhoodResponseDto } from '../dtos/neighborhood/neighborhood-response.dto';
import { PageOptionsDto } from '../dtos/common/page-options.dto';
import { PageDto } from '../dtos/common/page.dto';
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
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (1‑based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto libre sobre name' })
  @ApiResponse({ status: 200, type: [NeighborhoodResponseDto], description: 'Retorna lista completa sin paginación si no se especifican parámetros' })
  @ApiResponse({ status: 200, type: PageDto, description: 'Retorna resultado paginado cuando se especifica page o limit' })
  async list(@Query() opts: PageOptionsDto): Promise<NeighborhoodResponseDto[] | PageDto<NeighborhoodResponseDto>> {
    // Si no se especifica página o límite, retornar lista completa sin paginar
    if (!opts.page && !opts.limit && !opts.search) {
      const list: NeighborhoodDomainEntity[] = await this.service.listAll();
      return list.map(NeighborhoodResponseMapper.toDto);
    }
    
    // Si hay parámetros de paginación o búsqueda, usar listPaged
    return this.service.listPaged(opts);
  }
}
