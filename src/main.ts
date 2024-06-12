import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { executeMigrations } from './config';

async function main() {
  executeMigrations();
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  let description = 'Swagger for Esmorga API.';
  let swaggerConfigBuilder = new DocumentBuilder()
    .setTitle('Esmorga API')
    .setDescription(description)
    .setVersion('1.0');

  if (process.env.DNS_NAME) {
    description =
      `[Swagger in JSON format](${process.env.DNS_NAME}/swagger-json)\n\n` +
      description;
    swaggerConfigBuilder = swaggerConfigBuilder.addServer(process.env.DNS_NAME);
  }

  const swaggerConfig = swaggerConfigBuilder.build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(parseInt(process.env.APP_PORT));
}

main();
