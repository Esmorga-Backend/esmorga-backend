import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { executeMigrations } from './config';

const DNS_NAME = process.env.DNS_NAME;

async function main() {
  executeMigrations();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register({ db: 'mongodb' }),
  );

  app.set('trust proxy', true);

  app.useLogger(app.get(Logger));

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
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

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      operationsSorter: 'method',
    },
  });

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('APP_PORT'));
}

main();
