import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from '../controllers/event.controller';
import { GetEventListService } from '../../../application/event';
import { EventReposiory } from '../../../infraestructure/db/repositories';
import { EventSchema, Event } from '../../../infraestructure/db/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [EventController],
  providers: [GetEventListService, EventReposiory],
})
export class EventModule {}
