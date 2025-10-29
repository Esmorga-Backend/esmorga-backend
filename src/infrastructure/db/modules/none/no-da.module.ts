import { Module, Provider } from '@nestjs/common';
import { UserDA } from './user-da';
import { EventDA } from './event-da';
import { EventParticipantsDA } from './event-participant-da';
import { LoginAttemptsDA } from './login-attempts-da';
import { SessionDA } from './session-da';
import { TemporalCodeDA } from './temporal-code-da';
import { PollDA } from './poll-da';

const providers: Provider[] = [
  UserDA,
  EventDA,
  EventParticipantsDA,
  LoginAttemptsDA,
  PollDA,
  SessionDA,
  TemporalCodeDA,
];
@Module({
  providers: providers,
  exports: providers,
})
export class NoDataAccessModule {}
