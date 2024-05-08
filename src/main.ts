import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

async function main() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Esmorga API')
    .setDescription('Swagger for Esmorga API.')
    .setVersion('1.0')
    .addTag('Events')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3000);
}
main();
