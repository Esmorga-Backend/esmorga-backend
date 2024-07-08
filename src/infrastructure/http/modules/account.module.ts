import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AccountController } from '../controllers';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
} from '../../../application/handler/account';
import {
  AccountRepository,
  TokensRepository,
  EventRepository,
  EventParticipantsRepository,
} from '../../db/repositories';
import {
  UserSchema,
  User,
  TokensSchema,
  Tokens,
  EventSchema,
  Event,
  EventParticipantsSchema,
  EventParticipants,
} from '../../db/schema';
import { GenerateTokenPair } from '../../../domain/services';
import { AuthGuard } from '../guards';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    MongooseModule.forFeature([
      { name: EventParticipants.name, schema: EventParticipantsSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    GenerateTokenPair,
    AccountRepository,
    TokensRepository,
    EventRepository,
    EventParticipantsRepository,
    AuthGuard,
  ],
})
export class AccountModule {}
