import { Module, Provider } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserDA } from '../none/user-da';
import { UserMongoDA } from './user-mongo-da';
import {
  Event,
  EventParticipants,
  EventParticipantsSchema,
  EventSchema,
  LoginAttempts,
  LoginAttemptsSchema,
  Session,
  SessionSchema,
  TemporalCode,
  TemporalCodeSchema,
  User,
  UserSchema,
} from './schema';
import { EventDA } from '../none/event-da';
import { EventMongoDA } from './event-mongo-da';
import { EventParticipantsDA } from '../none/event-participant-da';
import { LoginAttemptsDA } from '../none/login-attempts-da';
import { LoginAttemptsMongoDA } from './login-attempts-mongo-da';
import { TemporalCodeDA } from '../none/temporal-code-da';
import { SessionDA } from '../none/session-da';
import { SessionMongoDA } from './session-mongo-da';
import { TemporalCodeMongoDA } from './temporal-code-mongo-da';
import { EventParticipantsMongoDA } from './event-participant-mongo-da';

const providers: Provider[] = [
  { provide: UserDA, useClass: UserMongoDA },
  { provide: EventDA, useClass: EventMongoDA },
  { provide: EventParticipantsDA, useClass: EventParticipantsMongoDA },
  { provide: LoginAttemptsDA, useClass: LoginAttemptsMongoDA },
  { provide: SessionDA, useClass: SessionMongoDA },
  { provide: TemporalCodeDA, useClass: TemporalCodeMongoDA },
];
@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: EventParticipants.name, schema: EventParticipantsSchema },
    ]),
    MongooseModule.forFeature([
      { name: LoginAttempts.name, schema: LoginAttemptsSchema },
    ]),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forFeature([
      { name: TemporalCode.name, schema: TemporalCodeSchema },
    ]),
  ],
  providers: providers,
  exports: providers,
})
export class MongoDataAccessModule {}
