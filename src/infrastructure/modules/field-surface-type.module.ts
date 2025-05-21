import { Module } from '@nestjs/common';

import { fieldSurfaceTypeProviders } from '../providers/field-surface-type/field-surface-type.providers';
import { FieldSurfaceTypeController } from '../adapters/inbound/http/controllers/field-surface-type.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [FieldSurfaceTypeController],
  providers: [...fieldSurfaceTypeProviders],
  exports: [...fieldSurfaceTypeProviders],
})
export class FieldSurfaceTypeModule {}
