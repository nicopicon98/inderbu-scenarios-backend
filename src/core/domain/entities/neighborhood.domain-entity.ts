export class NeighborhoodDomainEntity {
  public readonly id: number | null;
  public readonly name: string;

  constructor(builder: NeighborhoodDomainBuilder) {
    this.id   = builder.id;
    this.name = builder.name;
  }

  static builder(): NeighborhoodDomainBuilder {
    return new NeighborhoodDomainBuilder();
  }
}

export class NeighborhoodDomainBuilder {
  id: number | null = null;
  name: string      = '';

  withId(id: number): NeighborhoodDomainBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): NeighborhoodDomainBuilder {
    this.name = name;
    return this;
  }

  build(): NeighborhoodDomainEntity {
    return new NeighborhoodDomainEntity(this);
  }
}
