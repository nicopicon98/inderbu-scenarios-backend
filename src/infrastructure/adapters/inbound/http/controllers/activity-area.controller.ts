import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ActivityAreaResponseMapper } from 'src/infrastructure/mappers/activity-area/activity-area-response.mapper';
import { IActivityAreaApplicationPort } from 'src/core/application/ports/inbound/activity-area-application.port';
import { ActivityAreaResponseDto } from '../dtos/activity-area/activity-area-response.dto';
import { PageOptionsDto } from '../dtos/common/page-options.dto';
import { PageDto } from '../dtos/common/page.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';

@Controller('activity-areas')
export class ActivityAreaController {
  constructor(
    @Inject(APPLICATION_PORTS.ACTIVITY_AREA)
    private readonly service: IActivityAreaApplicationPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista de áreas de actividad' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (1-based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto libre sobre name' })
  @ApiResponse({ status: 200, type: [ActivityAreaResponseDto], description: 'Retorna lista completa sin paginación si no se especifican parámetros' })
  @ApiResponse({ status: 200, type: PageDto, description: 'Retorna resultado paginado cuando se especifica page o limit' })
  async list(@Query() opts: PageOptionsDto): Promise<ActivityAreaResponseDto[] | PageDto<ActivityAreaResponseDto>> {
    // Si no se especifica página o límite, retornar lista completa sin paginar
    if (!opts.page && !opts.limit && !opts.search) {
      const list = await this.service.listAll();
      return list.map(ActivityAreaResponseMapper.toDto);
    }
    
    // Si hay parámetros de paginación o búsqueda, usar listPaged
    return this.service.listPaged(opts);
  }
}
