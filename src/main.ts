import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from 'config/envs';

async function bootstrap() {

  const logger = new Logger('Main');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors();

  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  await app.listen(envs.port);

  logger.log(`Server running on port: http://localhost:${envs.port}`);
}
bootstrap();
