import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { validateEnvVars } from './config';
import { EventModule, AccountModule } from './infrastructure/http/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVars,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'LOCAL' ? 'info' : 'silent',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            ignore: 'pid,hostname,req',
          },
        },
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    EventModule,
    AccountModule,
  ],
})
export class AppModule {}
