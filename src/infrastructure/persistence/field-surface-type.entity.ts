import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { SubScenarioEntity } from './sub-scenario.entity';

@Entity('field_surface_types')
@Index('ft_fs_name', ['name'], { fulltext: true })
export class FieldSurfaceTypeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  // Un tipo de superficie puede estar asociado a varios sub-escenarios
  @OneToMany(() => SubScenarioEntity, (subScenario) => subScenario.fieldSurfaceType)
  subScenarios: SubScenarioEntity[];
}
