import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';
import { seedCities } from './infrastructure/seeds/cities.seed';
import { Inject } from '@nestjs/common';

export class AppCommandService {
  constructor(
    @Inject('DATA_SOURCE')
    private readonly databaseDatasource: DataSource
  ) {}

  @Command({
    command: 'start:seeds',
    describe:
      'Inicia todos los seeds',
  })
  async create() {
    const queryRunner = this.databaseDatasource.createQueryRunner();

    try {
      await queryRunner.connect();
      console.log('Ejecutando seeders...');
      await this.runSeeders(this.databaseDatasource);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        console.log('Revirtiendo la transacción...');
        await queryRunner.rollbackTransaction();
      }
    }
  }

  private async runSeeders(datasource: DataSource): Promise<void> {
    console.log('Ejecutando seeders...');
    await seedCities(datasource);
    console.log('Seeders ejecutados correctamente.');
  }
}
