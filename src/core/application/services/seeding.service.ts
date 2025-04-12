import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CityEntity } from '../../../infrastructure/persistence/city.entity';
import { NeighborhoodEntity } from '../../../infrastructure/persistence/neighborhood.entity';
import { CommuneEntity } from 'src/infrastructure/persistence/commune.entity';

const citySeeds = [
  {
    name: 'Bucaramanga',
  },
  {
    name: 'Floridablanca',
  },
  {
    name: 'Piedecuesta',
  },
  {
    name: 'Girón',
  },
];

const communeSeeds = [
  {
    name: 'ORIENTAL 13',
    cityName: 'Bucaramanga',
  },
];

const neighborhoodSeeds = [
  {
    name: 'San Alonso',
    communeName: 'ORIENTAL 13',
  },
  {
    name: 'Mejoras Publicas',
    communeName: 'ORIENTAL 13',
  },
];

@Injectable()
export class SeedingService {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  async seed(): Promise<void> {
    const cityRepository = this.dataSource.getRepository(CityEntity);
    const communeRepository: Repository<CommuneEntity> =
      this.dataSource.getRepository(CommuneEntity);
    const neighborhoodRepository =
      this.dataSource.getRepository(NeighborhoodEntity);

    // Sembrar ciudades
    const cityCount = await cityRepository.count();
    if (cityCount === 0) {
      console.log('Sembrando ciudades...');
      await cityRepository.save(citySeeds);
      console.log(`${citySeeds.length} ciudades sembradas correctamente.`);
    }

    // Sembrar comunas
    const communeCount: number = await communeRepository.count();
    if (communeCount === 0) {
      console.log('Sembrando comunas...');

      const newCommunes: CommuneEntity[] = [];

      for (const communeSeed of communeSeeds) {
        const cityRelated: CityEntity | null = await cityRepository.findOneBy({
          name: communeSeed.cityName,
        });

        if (!cityRelated) {
          console.warn(
            `Ciudad '${communeSeed.cityName}' no encontrada, saltando comuna '${communeSeed.name}'`,
          );
          continue;
        }

        newCommunes.push(
          communeRepository.create({
            name: communeSeed.name,
            city: { id: cityRelated.id },
          }),
        );
      }

      if (newCommunes.length > 0) {
        await communeRepository.save(newCommunes);
        console.log(`${newCommunes.length} comunas sembradas correctamente.`);
      }
    }

    // Sembrar barrios
    const neighborhoodCount = await neighborhoodRepository.count();
    if (neighborhoodCount === 0) {
      console.log('Sembrando barrios...');

      const newNeighborhoods: NeighborhoodEntity[] = [];

      for (const neighborhoodSeed of neighborhoodSeeds) {
        const communeRelated: CommuneEntity | null =
          await communeRepository.findOneBy({
            name: neighborhoodSeed.communeName,
          });

        if (!communeRelated) {
          console.warn(
            `Comuna '${neighborhoodSeed.communeName}' no encontrada, saltando barrio '${neighborhoodSeed.name}'`,
          );
          continue;
        }

        newNeighborhoods.push(
          neighborhoodRepository.create({
            name: neighborhoodSeed.name,
            commune: { id: communeRelated.id },
          }),
        );

        console.log('insertando el objeto', {
          name: neighborhoodSeed.name,
          commune: { id: communeRelated.id },
        });
      }

      if (newNeighborhoods.length > 0) {
        await neighborhoodRepository.save(newNeighborhoods);
        console.log(
          `${newNeighborhoods.length} barrios sembrados correctamente.`,
        );
      }
    }

    console.log('Proceso de siembra completado con éxito.');
  }
}
