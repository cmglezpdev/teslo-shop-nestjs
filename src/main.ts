import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger/dist';
import { SwaggerModule } from '@nestjs/swagger/dist/swagger-module';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
    );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo Shop endpoints')
    .setVersion('1.0')
    .build()
 
  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentation);
  
  await app.listen(+process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
