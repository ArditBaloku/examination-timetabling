import { Injectable } from '@nestjs/common';
import { HarmonySearchService } from './harmony-search/harmony-search.service';
import { InstanceContainer } from './instance-container/instance-container.service';

@Injectable()
export class AppService {
  constructor(
    private readonly instanceContainer: InstanceContainer,
    private readonly harmonySearchService: HarmonySearchService,
  ) {}

  main(): void {
    const [_, __, instanceName] = process.argv;

    this.instanceContainer.loadInstance(instanceName);
    this.harmonySearchService.run();
  }
}
