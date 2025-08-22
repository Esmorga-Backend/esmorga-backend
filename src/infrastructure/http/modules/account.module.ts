import { Module } from '@nestjs/common';
import { AccountController } from '../controllers';
import {
  ForgotPasswordService,
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
  GetMyEventsService,
  GetProfileService,
  CloseCurrentSessionService,
  DisjoinEventService,
  UpdateForgotPasswordService,
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

@Module({
  imports: [AccountSharedModule, EventSharedModule],
  controllers: [AccountController],
  providers: [
    ForgotPasswordService,
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    GetMyEventsService,
    GetProfileService,
    CloseCurrentSessionService,
    DisjoinEventService,
    UpdateForgotPasswordService,
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
  ],
})
export class AccountModule {}
