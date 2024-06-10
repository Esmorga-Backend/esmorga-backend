import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { EventDTO } from '../../dtos';
import { MongoRepository } from './mongo.repository';
import { Event as EventSchema } from '../schema';
import { DataBaseInternalError } from '../errors';
import { validateEventDto } from '../services';

@Injectable()
export class EventRepository extends MongoRepository<EventSchema> {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
  ) {
    super(eventModel);
  }

  /**
   * Get all events saved in the db.
   *
   * @returns - List of events mapped.
   * @throws {DataBaseInternalError} - If something wrong happend and it's not handle.
   */
  async getEventList(): Promise<EventDTO[]> {
    try {
      const events = await this.find();

      const adaptedEvents: EventDTO[] = events.map((event) => {
        const eventDto = plainToClass(EventDTO, event, {
          excludeExtraneousValues: true,
        });

        validateEventDto(eventDto);

        return eventDto;
      });

      return adaptedEvents;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
