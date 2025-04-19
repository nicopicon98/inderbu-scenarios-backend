import { NeighborhoodDomainEntity } from 'src/core/domain/entities/neighborhood.domain-entity';
import { NeighborhoodResponseDto } from '../../adapters/inbound/http/dtos/neighborhood/neighborhood-response.dto';

export class NeighborhoodResponseMapper {
  static toDto(d: NeighborhoodDomainEntity): NeighborhoodResponseDto {
    return { id: d.id!, name: d.name };
  }
}
