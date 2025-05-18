import { Expose } from 'class-transformer';

export class ReservationDomainEntity {
  @Expose() readonly id: number | null;
  @Expose() readonly reservationDate: Date;
  @Expose() readonly subScenarioId: number;
  @Expose() readonly userId: number;
  @Expose() readonly timeSlotId: number;
  @Expose() readonly reservationStateId: number;
  @Expose() readonly comments?: string;

  constructor(builder: ReservationDomainBuilder) {
    this.id = builder.id;
    this.reservationDate = builder.reservationDate;
    this.subScenarioId = builder.subScenarioId;
    this.userId = builder.userId;
    this.timeSlotId = builder.timeSlotId;
    this.reservationStateId = builder.reservationStateId;
    this.comments = builder.comments;
  }

  static builder(): ReservationDomainBuilder {
    return new ReservationDomainBuilder();
  }
}

export class ReservationDomainBuilder {
  id: number | null = null;
  reservationDate: Date;
  subScenarioId: number;
  userId: number;
  timeSlotId: number;
  reservationStateId: number;
  comments?: string;

  withId(id: number): this {
    this.id = id;
    return this;
  }
  withReservationDate(date: Date): this {
    this.reservationDate = date;
    return this;
  }
  withSubScenarioId(id: number): this {
    this.subScenarioId = id;
    return this;
  }
  withUserId(id: number): this {
    this.userId = id;
    return this;
  }
  withTimeSlotId(id: number): this {
    this.timeSlotId = id;
    return this;
  }
  withReservationStateId(id: number): this {
    this.reservationStateId = id;
    return this;
  }

  withComments(comments?: string): this {
    this.comments = comments;
    return this;
  }

  build(): ReservationDomainEntity {
    return new ReservationDomainEntity(this);
  }
}
