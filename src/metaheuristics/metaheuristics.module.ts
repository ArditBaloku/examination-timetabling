import { Module } from '@nestjs/common';
import { InstanceContainerModule } from 'src/instance-container/instance-container.module';
import { MetaheuristicsService } from './metaheuristics.service';

@Module({
  imports: [InstanceContainerModule],
  providers: [MetaheuristicsService],
  exports: [MetaheuristicsService],
})
export class MetaheuristicsModule {}
