import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Contacts API')
    .setDescription(
      `
      Contacts-API is a RESTful service for managing personal contacts, built with NestJS, TypeScript, and PostgreSQL.
      This API provides secure user authentication with JWT, supports contact CRUD operations,
      and implements advanced features such as token blacklist, caching, and rate limiting using Redis.
      `,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
