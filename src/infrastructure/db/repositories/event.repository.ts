import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../dtos';
import { MongoRepository } from './mongo.repository';
import { Event as EventSchema } from '../schema';
import { DataBaseInternalError, DataBaseNotFoundError } from '../errors';
import { CreateEventDto } from '../../http/dtos';
import { validateObjectDto } from '../services';
import { REQUIRED_DTO_FIELDS } from '../consts';

@Injectable()
export class EventRepository extends MongoRepository<EventSchema> {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(eventModel);
  }

  async createEvent(createEventDto: CreateEventDto, requestId?: string) {
    try {
      this.logger.info(
        `[EventRepository] [createEvent] - x-request-id:${requestId}`,
      );

      const event = new this.eventModel(createEventDto);

      await this.save(event);
    } catch (error) {
      this.logger.error(
        `[EventRepository] [createEvent] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async getEventList(requestId?: string): Promise<EventDto[]> {
    try {
      this.logger.info(
        `[EventRepository] [getEventList] - x-request-id:${requestId}`,
      );

      const events = await this.find();

      const adaptedEvents: EventDto[] = events.map((event) => {
        const eventDto = plainToClass(EventDto, event, {
          excludeExtraneousValues: true,
        });

        validateObjectDto(eventDto, REQUIRED_DTO_FIELDS.EVENTS);

        return eventDto;
      });

      return adaptedEvents;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEventList] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async getEvent(eventId: string, requestId?: string): Promise<EventDto> {
    try {
      this.logger.info(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}`,
      );

      const event = await this.findByIdentifier(eventId);

      if (!event) throw new DataBaseNotFoundError();

      const eventDto: EventDto = plainToClass(EventDto, event, {
        excludeExtraneousValues: true,
      });

      validateObjectDto(eventDto, REQUIRED_DTO_FIELDS.EVENTS);

      return eventDto;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }
}
