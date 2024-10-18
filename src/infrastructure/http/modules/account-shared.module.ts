import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';

@Module({
  imports: [JwtModule.register({})],
  controllers: [],
  providers: [AccountRepository, TokensRepository, EventParticipantsRepository],
  exports: [
    AccountRepository,
    TokensRepository,
    EventParticipantsRepository,
    JwtModule,
  ],
})
export class AccountSharedModule {}
