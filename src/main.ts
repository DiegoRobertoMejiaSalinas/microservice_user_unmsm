import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './utils/setup-swagger';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger()
  });

  app.useGlobalPipes(new ValidationPipe())

  setupSwagger(app)

  await app.listen(3000);
}
bootstrap();
