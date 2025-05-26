import { Expose, Type } from 'class-transformer';
import { CityDomainEntity } from './city.domain-entity';

export class CommuneDomainEntity {
  @Expose()
  public readonly id: number | null;

  @Expose()
  public readonly name: string;

  @Expose()
  public readonly cityId: number;

  @Expose()
  @Type(() => CityDomainEntity)
  public readonly city?: CityDomainEntity;

  constructor(builder: CommuneDomainBuilder) {
    this.id = builder.id;
    this.name = builder.name;
    this.cityId = builder.cityId;
    this.city = builder.city;
  }

  static builder(): CommuneDomainBuilder {
    return new CommuneDomainBuilder();
  }
}

class CommuneDomainBuilder {
  id: number | null = null;
  name: string = '';
  cityId: number = 0;
  city?: CityDomainEntity;

  withId(id: number): CommuneDomainBuilder {
    this.id = id;
    return this;
  }

  withName(name: string): CommuneDomainBuilder {
    this.name = name;
    return this;
  }

  withCityId(cityId: number): CommuneDomainBuilder {
    this.cityId = cityId;
    return this;
  }

  withCity(city: CityDomainEntity): CommuneDomainBuilder {
    this.city = city;
    return this;
  }

  build(): CommuneDomainEntity {
    return new CommuneDomainEntity(this);
  }
}
