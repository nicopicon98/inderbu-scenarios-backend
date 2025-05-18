// src/infrastructure/adapters/inbound/http/dtos/neighborhood/neighborhood-response.dto.ts

import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class NeighborhoodResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}
