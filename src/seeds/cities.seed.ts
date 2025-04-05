import { Logger } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { CityEntity } from 'src/city.entity';
import { DataSource, Repository } from 'typeorm';

interface ICitySeed {
  name: string;
}

export async function seedCities(datasource: DataSource) {
  const logger = new Logger('SeedCities');

  const cityRepository: Repository<CityEntity> =
    datasource.getRepository(CityEntity);

  // Load city seeds
  const seedFilePath = path.join(__dirname, './data/city-seeds.json');
  const citySeeds: ICitySeed[] = JSON.parse(
    fs.readFileSync(seedFilePath, 'utf8'),
  );

  for (const citySeed of citySeeds) {
    const existingCity = await cityRepository.findOneBy({
      name: citySeed.name,
    });

    //guard clause
    if (!existingCity) {
      // Crear entidad
      try {
        await cityRepository.save(citySeed);
        logger.log(`City ${citySeed.name} created.`);
      } catch (error) {
        logger.error(`Error creating City ${citySeed.name}: ${error.message}`)
      }
    } else {
        logger.warn(`City ${citySeed.name} already exists.`)
    }
  }
}
