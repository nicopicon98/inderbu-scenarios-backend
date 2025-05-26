export class ActivityAreaDomainEntity {
  public readonly id: number | null;
  public readonly name: string;

  constructor(builder: ActivityAreaDomainBuilder) {
    this.id = builder.id;
    this.name = builder.name;
  }

  static builder(): ActivityAreaDomainBuilder {
    return new ActivityAreaDomainBuilder();
  }
}

export class ActivityAreaDomainBuilder {
  id: number | null = null;
  name = '';

  withId(id: number) {
    this.id = id;
    return this;
  }

  withName(name: string) {
    this.name = name;
    return this;
  }

  build(): ActivityAreaDomainEntity {
    return new ActivityAreaDomainEntity(this);
  }
}
