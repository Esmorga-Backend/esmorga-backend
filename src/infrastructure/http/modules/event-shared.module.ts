import { Module } from '@nestjs/common';
import { EventRepository } from '../../../infrastructure/db/repositories';

@Module({
  imports: [],
  controllers: [],
  providers: [EventRepository],
  exports: [EventRepository],
})
export class EventSharedModule {}
