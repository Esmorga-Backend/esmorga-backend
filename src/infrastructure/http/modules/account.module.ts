import { Module } from '@nestjs/common';
import { AccountController } from '../controllers';
import {
  LoginService,
  RegisterService,
  RefreshTokenService,
  JoinEventService,
  DisjoinEventService,
} from '../../../application/handler/account';
import { GenerateTokenPair } from '../../../domain/services';
import { AuthGuard } from '../guards';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';

@Module({
  imports: [AccountSharedModule, EventSharedModule],
  controllers: [AccountController],
  providers: [
    LoginService,
    RegisterService,
    RefreshTokenService,
    JoinEventService,
    DisjoinEventService,
    GenerateTokenPair,
    AuthGuard,
  ],
})
export class AccountModule {}
