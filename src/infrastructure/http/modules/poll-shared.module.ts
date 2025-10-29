import { Module } from '@nestjs/common';
import { PollRepository } from '../../../infrastructure/db/repositories';

@Module({
  imports: [],
  controllers: [],
  providers: [PollRepository],
  exports: [PollRepository],
})
export class PollSharedModule {}
