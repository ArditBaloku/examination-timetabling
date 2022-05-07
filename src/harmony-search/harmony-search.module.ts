import { Module } from '@nestjs/common';
import { InstanceContainerModule } from 'src/instance-container/instance-container.module';
import { HarmonySearchService } from './harmony-search.service';

@Module({
  imports: [InstanceContainerModule],
  providers: [HarmonySearchService],
  exports: [HarmonySearchService],
})
export class HarmonySearchModule {}
