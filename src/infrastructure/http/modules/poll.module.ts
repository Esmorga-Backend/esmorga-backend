import { Module } from '@nestjs/common';
import { PollController } from '../controllers/poll.controller';
import { AuthGuard } from '../guards';
import {
  CreatePollService,
  GetPollListService,
} from '../../../application/handler/poll';
import { PollSharedModule } from './poll-shared.module';
import { AccountSharedModule } from './account-shared.module';

@Module({
  imports: [AccountSharedModule, PollSharedModule],
  controllers: [PollController],
  providers: [AuthGuard, CreatePollService, GetPollListService],
})
export class PollModule {}
