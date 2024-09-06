import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import {
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import {
  UserSchema,
  User,
  TokensSchema,
  Tokens,
  EventParticipantsSchema,
  EventParticipants,
} from '../../../infrastructure/db/schema';

@Module({
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tokens.name, schema: TokensSchema }]),
    MongooseModule.forFeature([
      { name: EventParticipants.name, schema: EventParticipantsSchema },
    ]),
  ],
  controllers: [],
  providers: [AccountRepository, TokensRepository, EventParticipantsRepository],
  exports: [
    AccountRepository,
    TokensRepository,
    EventParticipantsRepository,
    JwtModule,
    MongooseModule,
  ],
})
export class AccountSharedModule {}
