import { Expose } from 'class-transformer';

export class ReservationStateDomainEntity {
  @Expose() readonly id: number | null;
  @Expose() readonly name: string;

  constructor(builder: ReservationStateDomainBuilder) {
    this.id = builder.id;
    this.name = builder.name;
  }

  static builder(): ReservationStateDomainBuilder {
    return new ReservationStateDomainBuilder();
  }
}

export class ReservationStateDomainBuilder {
  id: number | null = null;
  name: string;

  withId(id: number): this {
    this.id = id;
    return this;
  }

  withName(name: string): this {
    this.name = name;
    return this;
  }

  build(): ReservationStateDomainEntity {
    return new ReservationStateDomainEntity(this);
  }
}
