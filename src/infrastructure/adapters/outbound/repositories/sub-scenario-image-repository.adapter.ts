import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { SubScenarioImageEntity } from 'src/infrastructure/persistence/image.entity';
import { ISubScenarioImageRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-image-repository.port';
import { SubScenarioImageDomainEntity } from 'src/core/domain/entities/sub-scenario-image.domain-entity';
import { SubScenarioImageEntityMapper } from 'src/infrastructure/mappers/images/image-entity.mapper';

@Injectable()
export class SubScenarioImageRepositoryAdapter
  implements ISubScenarioImageRepositoryPort
{
  constructor(
    @Inject(SubScenarioImageEntity)
    private readonly repository: Repository<SubScenarioImageEntity>,
  ) {}

  async save(
    image: SubScenarioImageDomainEntity,
  ): Promise<SubScenarioImageDomainEntity> {
    const entityToSave = SubScenarioImageEntityMapper.toPersistence(image);
    
    if (image.isFeature) {
      // Si es una imagen principal, asegurarse de que no haya otras imágenes principales
      await this.repository.update(
        { subScenario: { id: image.subScenarioId }, isFeature: true },
        { isFeature: false },
      );
    }
    
    const savedEntity = await this.repository.save(entityToSave);
    return SubScenarioImageEntityMapper.toDomain(savedEntity);
  }

  async findBySubScenarioId(
    subScenarioId: number,
  ): Promise<SubScenarioImageDomainEntity[]> {
    const entities = await this.repository.find({
      where: { subScenario: { id: subScenarioId } },
      order: { isFeature: 'DESC', displayOrder: 'ASC' },
    });
    return entities.map(SubScenarioImageEntityMapper.toDomain);
  }

  async findById(id: number): Promise<SubScenarioImageDomainEntity | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });
    return entity ? SubScenarioImageEntityMapper.toDomain(entity) : null;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async updateOrderAndFeature(
    images: SubScenarioImageDomainEntity[],
  ): Promise<SubScenarioImageDomainEntity[]> {
    const updatedImages: SubScenarioImageDomainEntity[] = [];
    
    for (const image of images) {
      if (!image.id) continue;
      
      await this.repository.update(
        { id: image.id },
        { 
          isFeature: image.isFeature,
          displayOrder: image.displayOrder
        },
      );
      
      const updatedEntity = await this.repository.findOne({
        where: { id: image.id },
      });
      
      if (updatedEntity) {
        updatedImages.push(SubScenarioImageEntityMapper.toDomain(updatedEntity));
      }
    }
    
    return updatedImages;
  }
}
