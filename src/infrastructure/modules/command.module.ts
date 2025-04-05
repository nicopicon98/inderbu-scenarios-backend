import { CommandModule } from 'nestjs-command';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AppCommandService } from 'src/app.command';

@Module({
  imports: [
    CommandModule,
    DatabaseModule // Añade esto para tener acceso a DATA_SOURCE
  ],
  providers: [
    AppCommandService
  ],
  exports: [AppCommandService] // Exporta el servicio para usarlo en AppModule
})
export class AppCommandModule {}