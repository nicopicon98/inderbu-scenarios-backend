import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ActivityAreaResponseMapper } from 'src/infrastructure/mappers/activity-area/activity-area-response.mapper';
import { IActivityAreaApplicationPort } from 'src/core/application/ports/inbound/activity-area-application.port';
import { ActivityAreaResponseDto } from '../dtos/activity-area/activity-area-response.dto';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';

@Controller('activity-areas')
export class ActivityAreaController {
  constructor(
    @Inject(APPLICATION_PORTS.ACTIVITY_AREA)
    private readonly service: IActivityAreaApplicationPort,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lista de áreas de actividad' })
  @ApiResponse({ status: 200, type: [ActivityAreaResponseDto] })
  async list(): Promise<ActivityAreaResponseDto[]> {
    const list = await this.service.listAll();
    return list.map(ActivityAreaResponseMapper.toDto);
  }
}
