import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from '../controllers';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
} from '../../../application/handler/account';
import { EventParticipantsRepository } from '../../db/repositories';
import { EventParticipantsSchema, EventParticipants } from '../../db/schema';
import { GenerateTokenPair } from '../../../domain/services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';

@Module({
  imports: [
    AccountSharedModule,
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
    GenerateTokenPair,
    EventParticipantsRepository,
    AuthGuard,
  ],
})
export class AccountModule {}
