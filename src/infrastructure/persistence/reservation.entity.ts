import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubScenarioEntity } from "./sub-scenario.entity";
import { UserEntity } from "./user.entity";
import { TimeSlotEntity } from "./time-slot.entity";
import { ReservationStateEntity } from "./reservation-state.entity";

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'date',
    transformer: {
      to: (value: Date) => {
        // Fuerza la fecha YYYY-MM-DD evitando conversiones
        return value.toISOString().split('T')[0];
      },
      from: (value: string) => new Date(value),
    },
  })
  reservationDate: Date;

  @ManyToOne(() => SubScenarioEntity, { eager: true })
  @JoinColumn({ name: 'fk_sub_scenario_id' })
  subScenario: SubScenarioEntity;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'fk_user_id' })
  user: UserEntity;

  @ManyToOne(() => TimeSlotEntity, { eager: true })
  @JoinColumn({ name: 'fk_time_slot_id' })
  timeSlot: TimeSlotEntity;

  @ManyToOne(() => ReservationStateEntity, { eager: true })
  @JoinColumn({ name: 'fk_reservation_state_id' })
  reservationState: ReservationStateEntity;

  @CreateDateColumn()
  createdAt: Date;
}
