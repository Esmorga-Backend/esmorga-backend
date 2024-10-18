import { DynamicModule, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { minutes, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { validateEnvVars, getLoggerConfig } from './config';
import { EventModule, AccountModule } from './infrastructure/http/modules';
import { RequestIdMiddleware } from './infrastructure/http/middlewares';
import { DataAccessModule } from './infrastructure/db/modules/data-access.module';

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
  static forRoot(db: 'mongodb' | 'none' = 'mongodb'): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          validate: validateEnvVars,
        }),
        ThrottlerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => [
            {
              ttl: minutes(config.get('API_RATE_LIMIT_TTL')),
              limit: config.get('API_RATE_LIMIT'),
            },
            {
              name: 'public',
              ttl: minutes(config.get('PUBLIC_API_RATE_LIMIT_TTL')),
              limit: config.get('PUBLIC_API_RATE_LIMIT'),
            },
          ],
        }),
        LoggerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return getLoggerConfig(configService.get('NODE_ENV'));
          },
        }),
        DataAccessModule.forRoot(db),
        EventModule,
        AccountModule,
      ],
      providers: [
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    };
  }
}
