import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../dtos';
import { MongoRepository } from './mongo.repository';
import { Event as EventSchema } from '../schema';
import { DataBaseBadRequestError, DataBaseInternalError } from '../errors';
import { CreateEventDto } from '../../http/dtos';
import { validateObjectDto, REQUIRED_FIELDS } from '../services';

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
        `[EventRepository] [createEvent] - x-request-id: ${requestId}`,
      );

      const event = new this.eventModel(createEventDto);

      await this.save(event);
    } catch (error) {
      this.logger.error(
        `[EventRepository] [createEvent] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async findOneByEventId(
    eventId: string,
    requestId?: string,
  ): Promise<EventDto> {
    try {
      this.logger.info(
        `[EventRepository] [findOneByEventId] - x-request-id: ${requestId}, eventId: ${eventId} `,
      );

      const event = await this.findOneById(eventId);

      if (!event) throw new DataBaseBadRequestError();

      const adaptedEvent: EventDto = plainToClass(EventDto, event, {
        excludeExtraneousValues: true,
      });

      validateObjectDto(adaptedEvent, REQUIRED_FIELDS.EVENTS);

      return adaptedEvent;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [findOneByEventId] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  async getEventList(requestId?: string): Promise<EventDto[]> {
    try {
      this.logger.info(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}`,
      );

      const events = await this.find();

      const adaptedEvents: EventDto[] = events.map((event) => {
        const eventDto = plainToClass(EventDto, event, {
          excludeExtraneousValues: true,
        });

        validateObjectDto(eventDto, REQUIRED_FIELDS.EVENTS);

        return eventDto;
      });

      return adaptedEvents;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  //TODO: Cambiar TODO
  async updateEvent(
    eventToUpdate, //TODO: UpdateEventDto,
    requestId?: string,
    // ): Promise<EventDto> {
  ) {
    try {
      this.logger.info(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}`,
      );

      // const event = await this.findOneById(eventToUpdate);

      // const adaptedEvents: EventDto = plainToClass(EventDto, event, {
      //   excludeExtraneousValues: true,
      // });

      // validateObjectDto(adaptedEvents, REQUIRED_FIELDS.EVENTS);

      // return adaptedEvents;
      return 'hola';
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
