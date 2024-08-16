import { Module } from '@nestjs/common';
import { EventController } from '../controllers/event.controller';
import { AuthGuard } from '../guards';
import {
  CreateEventService,
  DeleteEventService,
  GetEventListService,
  UpdateEventService,
} from '../../../application/handler/event';
import { EventSharedModule } from './event-shared.module';
import { AccountSharedModule } from './account-shared.module';

@Module({
  imports: [AccountSharedModule, EventSharedModule],
  controllers: [EventController],
  providers: [
    AuthGuard,
    CreateEventService,
    DeleteEventService,
    GetEventListService,
    UpdateEventService,
  ],
})
export class EventModule {}
