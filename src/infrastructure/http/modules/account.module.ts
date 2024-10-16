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
  UpdatePasswordService,
  ActivateAccountService,
  SendEmailVerificationService,
} from '../../../application/handler/account';
import {
  GenerateMailService,
  SessionGenerator,
  ValidateLoginCredentialsService,
} from '../../../domain/services';
import { NodemailerService } from '../../services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';
import {
  LoginAttemptsRepository,
  TemporalCodeRepository,
} from '../../db/repositories';
import {
  LoginAttemptsSchema,
  LoginAttempts,
  TemporalCodeSchema,
  TemporalCode,
} from '../../../infrastructure/db/schema';

@Module({
  imports: [
    AccountSharedModule,
    EventSharedModule,
    MongooseModule.forFeature([
      { name: LoginAttempts.name, schema: LoginAttemptsSchema },
    ]),
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
    UpdatePasswordService,
    ActivateAccountService,
    SessionGenerator,
    GenerateMailService,
    SendEmailVerificationService,
    ValidateLoginCredentialsService,
    LoginAttemptsRepository,
    TemporalCodeRepository,
    NodemailerService,
    AuthGuard,
    TemporalCodeRepository,
    MongooseModule,
  ],
})
export class AccountModule {}
