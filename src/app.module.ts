import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { InstanceContainerModule } from './instance-container/instance-container.module';
import { HarmonySearchModule } from './harmony-search/harmony-search.module';

@Module({
  imports: [InstanceContainerModule, HarmonySearchModule],
  providers: [AppService],
})
export class AppModule {}
