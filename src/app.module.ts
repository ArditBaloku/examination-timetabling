import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { InstanceContainerModule } from './instance-container/instance-container.module';
import { HarmonySearchModule } from './harmony-search/harmony-search.module';
import { SimulatedAnnealingModule } from './simulated-annealing/simulated-annealing.module';

@Module({
  imports: [
    InstanceContainerModule,
    HarmonySearchModule,
    SimulatedAnnealingModule,
  ],
  providers: [AppService],
})
export class AppModule {}
