import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/config/app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function loadEnv() {
  dotenv.config();
}
async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule);
  const swaggerConfigDocument = new DocumentBuilder()
    .setTitle('inderbu API')
    .setDescription('API para inderbu')
    .setVersion('1.0.0')
    .addTag('inderbu')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfigDocument);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
