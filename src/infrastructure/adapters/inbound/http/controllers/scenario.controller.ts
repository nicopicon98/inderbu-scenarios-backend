import { Controller, Get, Inject, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { IScenarioApplicationPort } from 'src/core/application/ports/inbound/scenario-application.port';
import { ScenarioResponseDto } from '../dtos/scenario/scenario-response.dto';
import { PageOptionsDto } from '../dtos/common/page-options.dto';
import { PageDto } from '../dtos/common/page.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { ScenarioResponseMapper } from 'src/infrastructure/mappers/scenario/scenario-response.mapper';

@Controller('scenarios')
export class ScenarioController {
  constructor(
    @Inject(APPLICATION_PORTS.SCENARIO)
    private readonly scenarioApplicationService: IScenarioApplicationPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista paginada de escenarios' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Página (1‑based)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Tamaño de página' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Texto libre sobre name' })
  @ApiQuery({ name: 'neighborhoodId', required: false, type: Number, description: 'Filtra por barrio' })
  @ApiResponse({ status: 200, type: PageDto })
  async getScenarios(
    @Query() opts: PageOptionsDto,
  ): Promise<PageDto<ScenarioResponseDto>> {
    return this.scenarioApplicationService.listPaged(opts);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un escenario por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del escenario' })
  @ApiResponse({ status: 200, type: ScenarioResponseDto })
  @ApiResponse({ status: 404, description: 'Escenario no encontrado' })
  async getScenarioById(@Param('id') id: number): Promise<ScenarioResponseDto> {
    const scenario = await this.scenarioApplicationService.getById(id);
    if (!scenario) throw new NotFoundException(`Escenario ${id} no encontrado`);
    return ScenarioResponseMapper.toDto(scenario);
  }
}
