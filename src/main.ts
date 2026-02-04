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

  const configService = app.get(ConfigService);
  const enableCors = configService.get<string>('ENABLE_CORS') === 'true';

  if (enableCors) {
    const corsOrigin = configService.get<string>('CORS_ORIGIN');

    if (!corsOrigin) {
      throw new Error('CORS_ORIGIN must be defined when ENABLE_CORS is true.');
    }

    const allowAllOrigins = corsOrigin === '*';
    const origins = allowAllOrigins
      ? true
      : corsOrigin
          .split(',')
          .map((origin) => origin.trim())
          .filter((origin) => origin.length > 0);
    const allowCredentials = !allowAllOrigins;

    app.enableCors({
      origin: origins,
      credentials: allowCredentials,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
  }

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
    .setVersion('1.1.1')
    .addServer(`${DNS_NAME}`)
    .setDescription(description)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      operationsSorter: 'method',
    },
  });

  await app.listen(configService.get<number>('APP_PORT'));
}

main();
