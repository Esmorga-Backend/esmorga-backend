import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { executeMigrations } from './config';

const DNS_NAME = process.env.DNS_NAME;

async function main() {
  executeMigrations();

  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  const description = DNS_NAME
    ? `[Swagger in JSON format](${DNS_NAME}/swagger-json)\n\n Swagger for Esmorga API.`
    : 'Swagger for Esmorga API.';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Esmorga API')
    .setVersion('1.0')
    .addServer(`${DNS_NAME}`)
    .setDescription(description)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('APP_PORT'));
}

main();
