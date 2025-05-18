import { SubScenarioImageResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/images/image-response.dto';
import { UpdateImageDto } from 'src/infrastructure/adapters/inbound/http/dtos/images/update-image.dto';
import { UpdateImagesOrderDto } from 'src/infrastructure/adapters/inbound/http/dtos/images/update-images-order.dto';

export interface ISubScenarioImageApplicationPort {
  uploadImage(
    subScenarioId: number,
    file: Express.Multer.File,
    isFeature?: boolean,
    displayOrder?: number,
  ): Promise<SubScenarioImageResponseDto>;
  
  getImagesBySubScenarioId(
    subScenarioId: number,
  ): Promise<SubScenarioImageResponseDto[]>;
  
  updateImage(
    imageId: number,
    updateDto: UpdateImageDto,
  ): Promise<SubScenarioImageResponseDto>;
  
  updateImagesOrder(
    subScenarioId: number,
    updateOrderDto: UpdateImagesOrderDto,
  ): Promise<SubScenarioImageResponseDto[]>;
  
  deleteImage(imageId: number): Promise<boolean>;
}
