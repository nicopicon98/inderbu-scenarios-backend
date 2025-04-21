import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ReservationController } from '../adapters/inbound/http/controllers/reservation.controller';
import { ReservationApplicationService } from 'src/core/application/services/reservation-application.service';
import { APPLICATION_PORTS } from 'src/core/application/tokens/ports';
import { REPOSITORY_PORTS } from '../tokens/ports';
import { ReservationRepositoryAdapter } from '../adapters/outbound/repositories/reservation-repository.adapter';
import { reservationProviders } from '../providers/reservation/reservation.providers';

@Module({
  imports: [
    DatabaseModule
  ],
  controllers: [ReservationController],
  providers: [...reservationProviders],
  exports: [],
})
export class ReservationModule {}
