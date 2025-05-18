import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  Inject,
  BadRequestException,
  ParseIntPipe,
  Query,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiParam, ApiResponse, ApiConsumes, ApiBody, ApiTags } from '@nestjs/swagger';

import { ISubScenarioImageApplicationPort } from 'src/core/application/ports/inbound/sub-scenario-image-application.port';
import { SubScenarioImageResponseDto } from '../dtos/images/image-response.dto';
import { CreateImageDto } from '../dtos/images/create-image.dto';
import { UpdateImageDto } from '../dtos/images/update-image.dto';
import { UpdateImagesOrderDto } from '../dtos/images/update-images-order.dto';

@ApiTags('Imágenes de Sub-escenarios')
@Controller('sub-scenarios')
export class SubScenarioImageController {
  constructor(
    @Inject('ISubScenarioImageApplicationPort')
    private readonly imageApplicationService: ISubScenarioImageApplicationPort,
  ) {}

  @Post(':subScenarioId/images')
  @ApiOperation({ summary: 'Sube una nueva imagen para un sub-escenario' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiBody({ type: CreateImageDto })
  @ApiResponse({ status: 201, type: SubScenarioImageResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('subScenarioId', ParseIntPipe) subScenarioId: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('isFeature') isFeature?: boolean,
    @Query('displayOrder') displayOrder?: number,
  ): Promise<SubScenarioImageResponseDto> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }
    
    return this.imageApplicationService.uploadImage(
      subScenarioId,
      file,
      isFeature,
      displayOrder,
    );
  }

  @Post(':subScenarioId/images/feature')
  @ApiOperation({ summary: 'Sube o actualiza la imagen principal del sub-escenario' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiBody({ type: CreateImageDto })
  @ApiResponse({ status: 201, type: SubScenarioImageResponseDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFeatureImage(
    @Param('subScenarioId', ParseIntPipe) subScenarioId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SubScenarioImageResponseDto> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }
    
    return this.imageApplicationService.uploadImage(
      subScenarioId,
      file,
      true, // Establecer como imagen principal
      0,    // Orden 0 para la imagen principal
    );
  }

  @Get(':subScenarioId/images')
  @ApiOperation({ summary: 'Obtiene todas las imágenes de un sub-escenario' })
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiResponse({ status: 200, type: [SubScenarioImageResponseDto] })
  async getImages(
    @Param('subScenarioId', ParseIntPipe) subScenarioId: number,
  ): Promise<SubScenarioImageResponseDto[]> {
    return this.imageApplicationService.getImagesBySubScenarioId(subScenarioId);
  }

  @Patch(':subScenarioId/images/:imageId')
  @ApiOperation({ summary: 'Actualiza una imagen específica' })
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiParam({ name: 'imageId', type: Number, description: 'ID de la imagen' })
  @ApiResponse({ status: 200, type: SubScenarioImageResponseDto })
  async updateImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() updateDto: UpdateImageDto,
  ): Promise<SubScenarioImageResponseDto> {
    return this.imageApplicationService.updateImage(imageId, updateDto);
  }

  @Patch(':subScenarioId/images/order')
  @ApiOperation({ summary: 'Actualiza el orden y la imagen principal de un sub-escenario' })
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiResponse({ status: 200, type: [SubScenarioImageResponseDto] })
  async updateImagesOrder(
    @Param('subScenarioId', ParseIntPipe) subScenarioId: number,
    @Body() updateOrderDto: UpdateImagesOrderDto,
  ): Promise<SubScenarioImageResponseDto[]> {
    return this.imageApplicationService.updateImagesOrder(subScenarioId, updateOrderDto);
  }

  @Post(':subScenarioId/images/multiple')
  @ApiOperation({ summary: 'Sube múltiples imágenes para un sub-escenario' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiResponse({ status: 201, type: [SubScenarioImageResponseDto] })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(
    @Param('subScenarioId', ParseIntPipe) subScenarioId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<SubScenarioImageResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }
    
    const results: SubScenarioImageResponseDto[] = [];
    
    // Obtener las imágenes existentes para determinar el orden correcto
    const existingImages = await this.imageApplicationService.getImagesBySubScenarioId(subScenarioId);
    let nextOrder = existingImages.length > 0
      ? Math.max(...existingImages.map(img => img.displayOrder)) + 1
      : 1; // Empezamos en 1 porque 0 está reservado para la imagen principal
    
    // Procesar cada archivo
    for (const file of files) {
      const image = await this.imageApplicationService.uploadImage(
        subScenarioId,
        file,
        false, // No son imágenes principales
        nextOrder++,
      );
      results.push(image);
    }
    
    return results;
  }

  @Delete(':subScenarioId/images/:imageId')
  @ApiOperation({ summary: 'Elimina una imagen específica' })
  @ApiParam({ name: 'subScenarioId', type: Number, description: 'ID del sub-escenario' })
  @ApiParam({ name: 'imageId', type: Number, description: 'ID de la imagen' })
  @ApiResponse({ status: 200, type: Boolean, description: 'true si se eliminó correctamente' })
  async deleteImage(
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<boolean> {
    return this.imageApplicationService.deleteImage(imageId);
  }
}
