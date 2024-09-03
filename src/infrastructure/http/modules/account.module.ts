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
} from '../../../application/handler/account';
import { GenerateTokenPair } from '../../../domain/services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';

import { VerificationCodeRepository } from '../../../infrastructure/db/repositories';
import {
  VerificationCodeSchema,
  VerificationCode,
} from '../../../infrastructure/db/schema';

@Module({
  imports: [
    AccountSharedModule,
    EventSharedModule,
    MongooseModule.forFeature([
      { name: VerificationCode.name, schema: VerificationCodeSchema },
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
    GenerateTokenPair,
    AuthGuard,
    VerificationCodeRepository,
    MongooseModule,
  ],
})
export class AccountModule {}
