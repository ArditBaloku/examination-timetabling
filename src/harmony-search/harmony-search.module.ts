import { Module } from '@nestjs/common';
import { ParserModule } from 'src/parser/parser.module';
import { HarmonySearchService } from './harmony-search.service';

@Module({
  imports: [ParserModule],
  providers: [HarmonySearchService],
  exports: [HarmonySearchService],
})
export class HarmonySearchModule {}
