import { Module } from '@nestjs/common';
import { InstanceContainerModule } from 'src/instance-container/instance-container.module';
import { MetaheuristicsModule } from 'src/metaheuristics/metaheuristics.module';
import { HarmonySearchService } from './harmony-search.service';

@Module({
  imports: [InstanceContainerModule, MetaheuristicsModule],
  providers: [HarmonySearchService],
  exports: [HarmonySearchService],
})
export class HarmonySearchModule {}
