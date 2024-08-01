import { Module } from '@nestjs/common';
import { EventController } from '../controllers/event.controller';
import {
  CreateEventService,
  GetEventListService,
} from '../../../application/handler/event';
import { EventSharedModule } from './event-shared.module';

@Module({
  imports: [EventSharedModule],
  controllers: [EventController],
  providers: [CreateEventService, GetEventListService],
})
export class EventModule {}
