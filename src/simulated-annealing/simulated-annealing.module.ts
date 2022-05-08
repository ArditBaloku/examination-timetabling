import { Module } from '@nestjs/common';
import { MetaheuristicsModule } from 'src/metaheuristics/metaheuristics.module';
import { SimulatedAnnealingService } from './simulated-annealing.service';

@Module({
  imports: [MetaheuristicsModule],
  providers: [SimulatedAnnealingService],
  exports: [SimulatedAnnealingService],
})
export class SimulatedAnnealingModule {}
