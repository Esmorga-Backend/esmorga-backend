import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { validateEnvVars } from './config';
import { EventModule, AccountModule } from './infraestructure/http/modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvVars,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    JwtModule.register({
      global: true,
      secret:
        'j1u5RDS8Ga4hzDcS1vGULNPHYMGjMfjINLarWJM9UIjAVPxgFUgA1tMc/OT4NItCzGqU/cGlkjg4l6kgqcNEcQ',
    }),
    EventModule,
    AccountModule,
  ],
})
export class AppModule {}
