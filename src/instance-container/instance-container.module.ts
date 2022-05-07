import { Module } from '@nestjs/common';
import { InstanceContainer } from './instance-container.service';

@Module({
  providers: [InstanceContainer],
  exports: [InstanceContainer],
})
export class InstanceContainerModule {}
