import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { ISubScenarioApplicationPort } from 'src/core/application/ports/inbound/sub-scenario-application.port';
import { SubScenarioWithRelationsDto } from '../dtos/sub-scenarios/sub-scenario-response-with-relations.dto';
import { PageOptionsDto } from '../dtos/common/page-options.dto';
import { PageDto } from '../dtos/common/page.dto';



@Controller('sub-scenarios')
export class SubScenarioController {
  constructor(
    @Inject('ISubScenarioApplicationPort')
    private readonly subScenarioApplicationService: ISubScenarioApplicationPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista paginada de sub‑escenarios' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (1‑based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto libre sobre name' })
  @ApiQuery({ name: 'scenarioId', required: false, type: Number, description: 'Filtra por escenario' })
  @ApiQuery({ name: 'activityAreaId', required: false, type: Number, description: 'Filtra por área de actividad' })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: Number, description: 'Filtra por barrio (id)' })
  @ApiResponse({ status: 200, type: PageDto })
  async getSubScenarios(
    @Query() opts: PageOptionsDto,
  ): Promise<PageDto<SubScenarioWithRelationsDto>> {
    return this.subScenarioApplicationService.listWithRelations(opts);
  }
}
