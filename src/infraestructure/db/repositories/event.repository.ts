import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { Event } from '../schema';
import { mapToEventsEntity } from '../services';

@Injectable()
export class EventReposiory extends MongoRepository<Event> {
  constructor(@InjectModel(Event.name) private userModel: Model<Event>) {
    super(userModel);
  }

  async getEventList() {
    try {
      const response = await this.find();

      const eventList = mapToEventsEntity(response);

      return eventList;
    } catch (error) {
      throw error;
    }
  }
}
