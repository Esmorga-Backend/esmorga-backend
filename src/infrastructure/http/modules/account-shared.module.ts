import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import {
  AccountRepository,
  SessionRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';

@Module({
  imports: [JwtModule.register({})],
  controllers: [],
  providers: [
    AccountRepository,
    SessionRepository,
    EventParticipantsRepository,
  ],
  exports: [
    AccountRepository,
    SessionRepository,
    EventParticipantsRepository,
    JwtModule,
  ],
})
export class AccountSharedModule {}
