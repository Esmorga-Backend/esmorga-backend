import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AccountController } from '../controllers';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
  GetMyEventsService,
} from '../../../application/handler/account';
import {
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../db/repositories';
import {
  UserSchema,
  User,
  TokensSchema,
  Tokens,
  EventParticipantsSchema,
  EventParticipants,
} from '../../db/schema';
import { GenerateTokenPair } from '../../../domain/services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
    MongooseModule.forFeature([
      { name: EventParticipants.name, schema: EventParticipantsSchema },
    ]),
    EventSharedModule,
  ],
  controllers: [AccountController],
  providers: [
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    GetMyEventsService,
    GenerateTokenPair,
    AccountRepository,
    TokensRepository,
    EventParticipantsRepository,
    AuthGuard,
  ],
})
export class AccountModule {}
