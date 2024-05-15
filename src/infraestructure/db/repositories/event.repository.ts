import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { Event } from '../../../domain/entities';
import { Event as EventSchema } from '../schema';
import { mapToEventsEntity } from '../services';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class EventRepository extends MongoRepository<EventSchema> {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
  ) {
    super(eventModel);
  }

  async getEventList(): Promise<Event[]> {
    try {
      const response = await this.find();

      const eventList = mapToEventsEntity(response);

      return eventList;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
