import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo-repository';
import { Event } from '../schema';

@Injectable()
export class EventReposiory extends MongoRepository<Event> {
  constructor(@InjectModel(Event.name) private userModel: Model<Event>) {
    super(userModel);
  }

  async getEventList() {
    try {
      return this.find();
    } catch (error) {
      throw error;
    }
  }
}
