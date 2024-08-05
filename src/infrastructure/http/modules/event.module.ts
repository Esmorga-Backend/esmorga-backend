import { Module } from '@nestjs/common';
import { EventController } from '../controllers/event.controller';
import {
  CreateEventService,
  GetEventListService,
} from '../../../application/handler/event';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';

@Module({
  imports: [EventSharedModule, AccountSharedModule],
  controllers: [EventController],
  providers: [CreateEventService, GetEventListService],
})
export class EventModule {}
