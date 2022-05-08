import { Module } from '@nestjs/common';
import { HarmonySearchModule } from 'src/harmony-search/harmony-search.module';
import { MetaheuristicsModule } from 'src/metaheuristics/metaheuristics.module';
import { SimulatedAnnealingModule } from 'src/simulated-annealing/simulated-annealing.module';
import { MemeticService } from './memetic.service';

@Module({
  imports: [
    SimulatedAnnealingModule,
    HarmonySearchModule,
    MetaheuristicsModule,
  ],
  providers: [MemeticService],
  exports: [MemeticService],
})
export class MemeticModule {}
