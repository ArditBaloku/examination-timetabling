import { Injectable } from '@nestjs/common';
import { ParserService } from './parser/parser.service';

@Injectable()
export class AppService {
  constructor(private readonly parserService: ParserService) {}

  main(): void {
    const [_, __, instanceName] = process.argv;

    this.parserService.loadInstance(instanceName);
  }
}
