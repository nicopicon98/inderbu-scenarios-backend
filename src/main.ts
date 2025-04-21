import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './infrastructure/modules/config/app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './infrastructure/common/incerceptors/response.intecerptor';
import { HttpExceptionFilter } from './infrastructure/common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

function loadEnv() {
  dotenv.config();
}
async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule);
  // Registro de interceptores globales
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Registro de filters globales
  app.useGlobalFilters(new HttpExceptionFilter());
  // Registro de pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Transforma los payloads según los DTOs
      whitelist: true, // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades adicionales
      forbidUnknownValues: true, // Opcional, para asegurarse de que sólo se validen los valores conocidos
    }),
  );
  // Configuración de CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // Registro de swagger
  const swaggerConfigDocument = new DocumentBuilder()
    .setTitle('inderbu API')
    .setDescription('API para inderbu')
    .setVersion('1.0.0')
    .addTag('inderbu')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'jwt-auth', // nombre arbitrario de la seguridad
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfigDocument);
  SwaggerModule.setup('api-docs', app, document);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
