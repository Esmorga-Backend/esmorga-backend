import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { EventDto } from '../../dtos';
import { MongoRepository } from './mongo.repository';
import { Event as EventSchema } from '../schema';
import { DataBaseInternalError } from '../errors';
import { CreateEventDto } from '../../http/dtos';
import { validateEventDto } from '../services';

@Injectable()
export class EventRepository extends MongoRepository<EventSchema> {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
  ) {
    super(eventModel);
  }

  async createEvent(createEventDto: CreateEventDto) {
    try {
      const event = new this.eventModel(createEventDto);

      await this.create(event);
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }

  async getEventList(): Promise<EventDto[]> {
    try {
      const events = await this.find();

      const adaptedEvents: EventDto[] = events.map((event) => {
        const eventDto = plainToClass(EventDto, event, {
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
