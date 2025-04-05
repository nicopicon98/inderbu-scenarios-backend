import { Expose } from 'class-transformer';

export class CityDomain {
  @Expose()
  public readonly id: number | null;

  @Expose()
  public readonly name: string;

  constructor(builder: CityDomainBuilder) {
    this.id = builder.id;
    this.name = builder.name;
  }

  static builder(): CityDomainBuilder {
    return new CityDomainBuilder();
  }
}

class CityDomainBuilder {
  id: number | null = null;
  name: string = '';

  withId(id: number): CityDomainBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): CityDomainBuilder {
    this.name = name;
    return this;
  }

  build(): CityDomain {
    return new CityDomain(this);
  }
}
