import { Command } from 'nestjs-command';
import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import { DATA_SOURCE } from 'src/infrastructure/tokens/data_sources';


export class AppCommandService {
  constructor(
    @Inject(DATA_SOURCE.MYSQL)
    private readonly datasource: DataSource
  ) {}

  @Command({
    command: 'start:seeds',
    describe:
      'Inicia todos los seeds',
  })
  async create() {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      console.log('Ejecutando seeders...');
      await this.runSeeders(this.datasource);
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        console.log('Revirtiendo la transacción...');
        await queryRunner.rollbackTransaction();
      }
    }
  }

  private async runSeeders(datasource: DataSource): Promise<void> {
    console.log('Ejecutando seeders...');
    // await seedCities(datasource);
    console.log('Seeders ejecutados correctamente.');
  }
}
