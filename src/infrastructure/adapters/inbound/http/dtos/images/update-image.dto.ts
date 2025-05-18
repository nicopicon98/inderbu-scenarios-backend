import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateImageDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isFeature?: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
