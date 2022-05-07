import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);

  try {
    appService.main();
  } catch (error) {
    console.error(error);
    await app.close();
  }
}
bootstrap();
