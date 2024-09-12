import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from '../controllers';
import {
  ForgotPasswordService,
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
  GetMyEventsService,
  DisjoinEventService,
  ActivateAccountService,
  SendEmailVerificationService,
} from '../../../application/handler/account';
import {
  GenerateMailService,
  GenerateTokenPair,
} from '../../../domain/services';
import { NodemailerService } from '../../services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';
import { TemporalCodeRepository } from '../../db/repositories';
import {
  TemporalCodeSchema,
  TemporalCode,
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
    ForgotPasswordService,
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    GetMyEventsService,
    DisjoinEventService,
    ActivateAccountService,
    GenerateTokenPair,
    GenerateMailService,
    SendEmailVerificationService,
    TemporalCodeRepository,
    NodemailerService,
    AuthGuard,
    TemporalCodeRepository,
    MongooseModule,
  ],
})
export class AccountModule {}
