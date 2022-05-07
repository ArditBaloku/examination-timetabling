import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ParserModule } from './parser/parser.module';
import { HarmonySearchModule } from './harmony-search/harmony-search.module';

@Module({
  imports: [ParserModule, HarmonySearchModule],
  providers: [AppService],
})
export class AppModule {}
