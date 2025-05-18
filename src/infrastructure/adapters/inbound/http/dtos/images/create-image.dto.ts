import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, Min } from 'class-validator';

export class CreateImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isFeature?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  displayOrder?: number;
}
