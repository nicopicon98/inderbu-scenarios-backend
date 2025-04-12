import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ICityApplicationPort } from 'src/core/application/ports/inbound/city-application.port';
import { CityEntity } from 'src/infrastructure/persistence/city.entity';
import { DataSource } from 'typeorm';

@Controller('cities')
export class CityController {
  constructor(
    @Inject('ICityApplicationPort')
    private readonly cityApplicationService: ICityApplicationPort
  ) {}

  @Get()
  async getAll() {
    return this.cityApplicationService.getAll();
  }

  @Get('/:id')
  async findById(
    @Query('id') id: number
  ) {
    return this.cityApplicationService.findById(id);
  }
}
