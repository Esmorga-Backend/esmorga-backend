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
  UpdatePasswordService,
} from '../../../application/handler/account';
import {
  GenerateTokenPair,
  GenerateMailService,
} from '../../../domain/services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';
import { VerificationCodeRepository } from '../../db/repositories';
import { NodemailerService } from '../../services';
import {
  VerificationCode,
  VerificationCodeSchema,
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
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    GetMyEventsService,
    DisjoinEventService,
    UpdatePasswordService,
    GenerateTokenPair,
    GenerateMailService,
    VerificationCodeRepository,
    NodemailerService,
    AuthGuard,
  ],
})
export class AccountModule {}
