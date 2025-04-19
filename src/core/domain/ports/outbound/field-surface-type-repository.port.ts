import { FieldSurfaceTypeDomainEntity } from '../../entities/field-surface-type.domain-entity';

export interface IFieldSurfaceTypeRepositoryPort {
  findById(id: number): Promise<FieldSurfaceTypeDomainEntity | null>;
  findByIds(ids: number[]): Promise<FieldSurfaceTypeDomainEntity[]>;
  save(entity: FieldSurfaceTypeDomainEntity): Promise<void>;
}
