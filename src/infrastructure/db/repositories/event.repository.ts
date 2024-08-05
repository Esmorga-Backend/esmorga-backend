import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../dtos';
import { CreateEventDto } from '../../http/dtos';
import { MongoRepository } from './mongo.repository';
import { Event as EventSchema } from '../schema';
import {
  DataBaseBadRequestError,
  DataBaseInternalError,
  DataBaseNotFoundError,
} from '../errors';
import { validateObjectDto } from '../services';
import { getNullFields } from '../../../domain/services';
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

      validateObjectDto(adaptedEvent, REQUIRED_DTO_FIELDS.EVENTS);

      return adaptedEvent;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [findOneByEventId] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error.path === '_id') throw new DataBaseBadRequestError();

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

        validateObjectDto(eventDto, REQUIRED_DTO_FIELDS.EVENTS);

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

  async updateEvent(
    uuid: string,
    eventId: string,
    fieldsToUpdate: object,
    requestId?: string,
  ): Promise<EventDto> {
    try {
      this.logger.info(
        `[EventRepository] [updateEvent] - x-request-id: ${requestId}, eventId: ${eventId}`,
      );

      const nullFields = getNullFields(fieldsToUpdate);

      if (Object.keys(nullFields).length > 0) {
        await this.removeFieldsById(eventId, nullFields);
        Object.keys(nullFields).forEach((key) => {
          delete fieldsToUpdate[key];
        });
      }

      const updatedEvent = await this.updateById(eventId, {
        ...fieldsToUpdate,
        updatedBy: uuid,
      });

      const adaptedEvent: EventDto = plainToClass(EventDto, updatedEvent, {
        excludeExtraneousValues: true,
      });

      validateObjectDto(adaptedEvent, REQUIRED_DTO_FIELDS.EVENTS);

      return adaptedEvent;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [updateEvent] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async getEvent(eventId: string, requestId?: string): Promise<EventDto> {
    try {
      this.logger.info(
        `[EventRepository] [getEventList] - x-request-id: ${requestId}`,
      );

      const event = await this.findById(eventId);

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

      // In case eventId is malformed from db side for char length
      if (error.path === '_id') throw new DataBaseNotFoundError();

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }
}
