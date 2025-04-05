import { CommandModule } from 'nestjs-command';
import { Module } from '@nestjs/common';
import { AppCommandService } from './app.command';

@Module({
  imports: [CommandModule],
  providers: [
    AppCommandService
  ]
})
export class AppCommandModule {}
