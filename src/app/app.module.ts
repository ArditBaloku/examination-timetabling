import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { InstanceContainerModule } from '../instance-container/instance-container.module';
import { HarmonySearchModule } from '../harmony-search/harmony-search.module';
import { SimulatedAnnealingModule } from '../simulated-annealing/simulated-annealing.module';
import { MemeticModule } from 'src/memetic/memetic.module';

@Module({
  imports: [
    InstanceContainerModule,
    HarmonySearchModule,
    SimulatedAnnealingModule,
    MemeticModule,
  ],
  providers: [AppService],
})
export class AppModule {}
