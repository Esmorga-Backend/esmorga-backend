import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { EventDto } from '../../dtos';
import { MongoRepository } from './mongo.repository';
import { Event as EventSchema } from '../schema';
import { DataBaseInternalError } from '../errors';
import { CreateEventDto } from '../../http/dtos';

@Injectable()
export class EventRepository extends MongoRepository<EventSchema> {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
  ) {
    super(eventModel);
  }

  /**
   * Create a new event and save it in the db.
   *
   * @throws {DataBaseInternalError} - If something wrong happend and it's not handle.
   */
  async createEvent(event: CreateEventDto) {
    try {
      await this.create(event);
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }

  /**
   * Get all events saved in the db.
   *
   * @returns - List of events mapped.
   * @throws {DataBaseInternalError} - If something wrong happend and it's not handle.
   */
  async getEventList(): Promise<EventDto[]> {
    try {
      const events = await this.find();

      const adaptedEvents: EventDto[] = events.map((event) => {
        return plainToClass(EventDto, event, { excludeExtraneousValues: true });
      });

      return adaptedEvents;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
