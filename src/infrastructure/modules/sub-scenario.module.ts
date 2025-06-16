import { diskStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

import { SubScenarioImageController } from '../adapters/inbound/http/controllers/sub-scenario-image.controller';
import { subScenarioImageProviders } from '../providers/sub-scenario-image/sub-scenario-image.providers';
import { SubScenarioController } from '../adapters/inbound/http/controllers/sub-scenario.controller';
import { FileStorageService } from '../adapters/outbound/file-storage/file-storage.service';
import { subScenarioProviders } from '../providers/sub-scenario/sub-scenario.providers';
import { DatabaseModule } from './database/database.module';


@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      dest: './uploads/temp', // Archivos temporales en carpeta separada
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (req, file, cb) => {
          // Generar nombre único para archivo temporal
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = file.originalname.split('.').pop() || 'tmp';
          cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Validar que sea una imagen
        if (file.mimetype.startsWith('image/')) {
          cb(null, true);
        } else {
          cb(new Error('Solo se permiten archivos de imagen'), false);
        }
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB máximo
        files: 10 // Máximo 10 archivos
      }
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
  ],
  controllers: [SubScenarioController, SubScenarioImageController],
  providers: [...subScenarioProviders, ...subScenarioImageProviders, FileStorageService],
  exports: [],
})
export class SubScenarioModule {}
