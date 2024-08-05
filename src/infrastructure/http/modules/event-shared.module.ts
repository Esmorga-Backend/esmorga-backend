import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventRepository } from '../../../infrastructure/db/repositories';
import { EventSchema, Event } from '../../../infrastructure/db/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [],
  providers: [EventRepository],
  exports: [EventRepository, MongooseModule],
})
export class EventSharedModule {}
