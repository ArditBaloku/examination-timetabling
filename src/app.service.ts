import { Injectable } from '@nestjs/common';
import { HarmonySearchService } from './harmony-search/harmony-search.service';
import { ParserService } from './parser/parser.service';

@Injectable()
export class AppService {
  constructor(
    private readonly parserService: ParserService,
    private readonly harmonySearchService: HarmonySearchService,
  ) {}

  main(): void {
    const [_, __, instanceName] = process.argv;

    this.parserService.loadInstance(instanceName);
    this.harmonySearchService.run();
  }
}
