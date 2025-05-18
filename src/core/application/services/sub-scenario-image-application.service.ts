import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ISubScenarioImageApplicationPort } from '../ports/inbound/sub-scenario-image-application.port';
import { SubScenarioImageResponseDto } from 'src/infrastructure/adapters/inbound/http/dtos/images/image-response.dto';
import { UpdateImageDto } from 'src/infrastructure/adapters/inbound/http/dtos/images/update-image.dto';
import { UpdateImagesOrderDto } from 'src/infrastructure/adapters/inbound/http/dtos/images/update-images-order.dto';
import { ISubScenarioImageRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-image-repository.port';
import { ISubScenarioRepositoryPort } from 'src/core/domain/ports/outbound/sub-scenario-repository.port';
import { SubScenarioImageDomainEntity } from 'src/core/domain/entities/sub-scenario-image.domain-entity';
import { SubScenarioImageResponseMapper } from 'src/infrastructure/mappers/images/image-response.mapper';
import { REPOSITORY_PORTS } from 'src/infrastructure/tokens/ports';
import { FileStorageService } from 'src/infrastructure/adapters/outbound/file-storage/file-storage.service';

@Injectable()
export class SubScenarioImageApplicationService
  implements ISubScenarioImageApplicationPort
{
  constructor(
    @Inject(REPOSITORY_PORTS.SUB_SCENARIO_IMAGE)
    private readonly imageRepository: ISubScenarioImageRepositoryPort,
    @Inject(REPOSITORY_PORTS.SUB_SCENARIO)
    private readonly subScenarioRepository: ISubScenarioRepositoryPort,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async uploadImage(
    subScenarioId: number,
    file: Express.Multer.File,
    isFeature: boolean = false,
    displayOrder: number = 0,
  ): Promise<SubScenarioImageResponseDto> {
    // Verificar que el sub-escenario exista
    const subScenario = await this.subScenarioRepository.findById(subScenarioId);
    if (!subScenario) {
      throw new NotFoundException(`SubScenario con ID ${subScenarioId} no encontrado`);
    }

    // Guardar el archivo utilizando el servicio de almacenamiento
    const relativePath = await this.fileStorageService.saveFile(file);

    // Si es una imagen principal y hay otras imágenes, obtener la última posición
    let order = displayOrder;
    if (!isFeature && displayOrder === 0) {
      const existingImages = await this.imageRepository.findBySubScenarioId(subScenarioId);
      if (existingImages.length > 0) {
        const maxOrder = Math.max(...existingImages.map(img => img.displayOrder));
        order = maxOrder + 1;
      }
    }

    // Crear y guardar la entidad de imagen
    const imageDomain = SubScenarioImageDomainEntity.builder()
      .withPath(relativePath)
      .withIsFeature(isFeature)
      .withDisplayOrder(order)
      .withSubScenarioId(subScenarioId)
      .build();

    const savedImage = await this.imageRepository.save(imageDomain);
    return SubScenarioImageResponseMapper.toDto(savedImage);
  }

  async getImagesBySubScenarioId(
    subScenarioId: number,
  ): Promise<SubScenarioImageResponseDto[]> {
    const images = await this.imageRepository.findBySubScenarioId(subScenarioId);
    return images.map(SubScenarioImageResponseMapper.toDto);
  }

  async updateImage(
    imageId: number,
    updateDto: UpdateImageDto,
  ): Promise<SubScenarioImageResponseDto> {
    const image = await this.imageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Imagen con ID ${imageId} no encontrada`);
    }

    const updatedImage = SubScenarioImageDomainEntity.builder()
      .withId(image.id!)
      .withPath(image.path)
      .withIsFeature(updateDto.isFeature !== undefined ? updateDto.isFeature : image.isFeature)
      .withDisplayOrder(updateDto.displayOrder !== undefined ? updateDto.displayOrder : image.displayOrder)
      .withSubScenarioId(image.subScenarioId)
      .withCreatedAt(image.createdAt ?? new Date())
      .build();

    const savedImage = await this.imageRepository.save(updatedImage);
    return SubScenarioImageResponseMapper.toDto(savedImage);
  }

  async updateImagesOrder(
    subScenarioId: number,
    updateOrderDto: UpdateImagesOrderDto,
  ): Promise<SubScenarioImageResponseDto[]> {
    // Verificar que el sub-escenario exista
    const subScenario = await this.subScenarioRepository.findById(subScenarioId);
    if (!subScenario) {
      throw new NotFoundException(`SubScenario con ID ${subScenarioId} no encontrado`);
    }

    // Obtener todas las imágenes del sub-escenario
    const existingImages = await this.imageRepository.findBySubScenarioId(subScenarioId);
    const existingImageIds = new Set(existingImages.map(img => img.id));

    // Verificar que todas las imágenes en la solicitud pertenezcan al sub-escenario
    const updateImageIds = updateOrderDto.images.map(img => img.id);
    const invalidImageIds = updateImageIds.filter(id => !existingImageIds.has(id));
    
    if (invalidImageIds.length > 0) {
      throw new BadRequestException(`Las siguientes imágenes no pertenecen al sub-escenario: ${invalidImageIds.join(', ')}`);
    }

    // Verificar que solo haya una imagen principal
    const featureImages = updateOrderDto.images.filter(img => img.isFeature);
    if (featureImages.length > 1) {
      throw new BadRequestException('Solo puede haber una imagen principal');
    }

    // Crear entidades de dominio para actualizar
    const imagesToUpdate = updateOrderDto.images.map(img => {
      return SubScenarioImageDomainEntity.builder()
        .withId(img.id)
        .withIsFeature(img.isFeature)
        .withDisplayOrder(img.displayOrder)
        .withSubScenarioId(subScenarioId)
        .withPath('') // No es relevante para la actualización
        .build();
    });

    // Actualizar las imágenes
    const updatedImages = await this.imageRepository.updateOrderAndFeature(imagesToUpdate);
    return updatedImages.map(SubScenarioImageResponseMapper.toDto);
  }

  async deleteImage(imageId: number): Promise<boolean> {
    const image = await this.imageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundException(`Imagen con ID ${imageId} no encontrada`);
    }

    // Eliminar el archivo físico primero
    await this.fileStorageService.deleteFile(image.path);
    
    // Luego eliminar el registro de la base de datos
    return this.imageRepository.delete(imageId);
  }
}
