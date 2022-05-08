import { Module } from '@nestjs/common';
import { InstanceContainerModule } from 'src/instance-container/instance-container.module';
import { SimulatedAnnealingService } from './simulated-annealing.service';

@Module({
  imports: [InstanceContainerModule],
  providers: [SimulatedAnnealingService],
  exports: [SimulatedAnnealingService],
})
export class SimulatedAnnealingModule {}
