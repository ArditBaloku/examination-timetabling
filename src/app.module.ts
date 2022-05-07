import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ParserModule } from './parser/parser.module';

@Module({
  imports: [ParserModule],
  providers: [AppService],
})
export class AppModule {}
