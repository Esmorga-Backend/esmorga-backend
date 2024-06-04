import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from '../controllers/event.controller';
import {
  CreateEventService,
  GetEventListService,
} from '../../../application/handler/event';
import { EventRepository } from '../../../infraestructure/db/repositories';
import { EventSchema, Event } from '../../../infraestructure/db/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [CreateEventService, GetEventListService, EventRepository],
})
export class EventModule {}
