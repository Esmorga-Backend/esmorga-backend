import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from '../controllers';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
  GetMyEventsService,
  DisjoinEventService,
  ActivateAccount,
} from '../../../application/handler/account';
import {
  GenerateTokenPair,
  GenerateMailService,
} from '../../../domain/services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';
import { TemporalCodeRepository } from '../../db/repositories';
import { NodemailerService } from '../../services';
import {
  TemporalCode,
  TemporalCodeSchema,
} from '../../../infrastructure/db/schema';

@Module({
  imports: [
    AccountSharedModule,
    EventSharedModule,
    MongooseModule.forFeature([
      { name: TemporalCode.name, schema: TemporalCodeSchema },
    ]),
  ],
  controllers: [AccountController],
  providers: [
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    GetMyEventsService,
    DisjoinEventService,
    ActivateAccount,
    GenerateTokenPair,
    GenerateMailService,
    TemporalCodeRepository,
    NodemailerService,
    AuthGuard,
  ],
})
export class AccountModule {}
