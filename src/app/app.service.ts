import { Injectable } from '@nestjs/common';
import { HarmonySearchService } from '../harmony-search/harmony-search.service';
import { InstanceContainer } from '../instance-container/instance-container.service';
import { SimulatedAnnealingService } from '../simulated-annealing/simulated-annealing.service';

@Injectable()
export class AppService {
  constructor(
    private readonly instanceContainer: InstanceContainer,
    private readonly harmonySearchService: HarmonySearchService,
    private readonly simulatedAnnealingService: SimulatedAnnealingService,
  ) {}

  main(): void {
    const [_, __, algorithmName, instanceName] = process.argv;

    this.instanceContainer.loadInstance(instanceName);

    switch (algorithmName) {
      case 'hs':
        this.harmonySearchService.run();
        break;
      case 'sa':
        this.simulatedAnnealingService.run();
        break;
      default:
        throw new Error(`Algorithm ${algorithmName} not found`);
    }
  }
}
