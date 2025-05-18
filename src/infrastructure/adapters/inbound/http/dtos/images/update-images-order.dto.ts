import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ImageOrderItem {
  @ApiProperty()
  id: number;

  @ApiProperty()
  isFeature: boolean;

  @ApiProperty()
  displayOrder: number;
}

export class UpdateImagesOrderDto {
  @ApiProperty({ type: [ImageOrderItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageOrderItem)
  images: ImageOrderItem[];
}
