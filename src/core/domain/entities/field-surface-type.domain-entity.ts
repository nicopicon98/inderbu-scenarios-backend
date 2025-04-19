export class FieldSurfaceTypeDomainEntity {
  public readonly id: number | null;
  public readonly name: string;

  constructor(builder: FieldSurfaceTypeDomainBuilder) {
    this.id   = builder.id;
    this.name = builder.name;
  }

  static builder(): FieldSurfaceTypeDomainBuilder {
    return new FieldSurfaceTypeDomainBuilder();
  }
}

export class FieldSurfaceTypeDomainBuilder {
  id: number | null = null;
  name: string      = '';

  withId(id: number): FieldSurfaceTypeDomainBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): FieldSurfaceTypeDomainBuilder {
    this.name = name;
    return this;
  }

  build(): FieldSurfaceTypeDomainEntity {
    return new FieldSurfaceTypeDomainEntity(this);
  }
}
