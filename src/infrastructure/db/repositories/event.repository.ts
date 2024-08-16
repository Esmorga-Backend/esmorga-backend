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
import { REQUIRED_DTO_FIELDS } from '../consts';

@Injectable()
export class EventRepository extends MongoRepository<EventSchema> {
  constructor(
    @InjectModel(EventSchema.name) private eventModel: Model<EventSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(eventModel);
  }

  /**
   * Store a new event document.
   *
   * @param createEventDto - Event data provided.
   * @param requestId - Request identifier for API logger.
   */
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

  /**
   * Find a event by ID, validate the data stores and return it following business schema.
   *
   * @param eventId - Event identifier.
   * @param requestId - Request identifier.
   * @returns EventDto - Event object following business schema after validate DB document.
   * @throws DataBaseBadRequestError - ID malformed or not found
   */
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

      validateObjectDto(adaptedEvent, REQUIRED_DTO_FIELDS.UPDATE_EVENT);

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

  /**
   * Return all events stored in the DB.
   *
   * @param requestId - Request identifier for API logger.
   * @returns Promise of EventDto array.
   */
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

  /**
   * Update event found by eventId.
   *
   * @param uuid - User identifier.
   * @param eventId - Event identifier.
   * @param fieldsToUpdate - Event fields to update.
   * @param requestId - Request identifier for API logger.
   * @returns EventDto - Event object following business schema after validate DB document.
   */
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

  /**
   * Return events list related to IDs provided in string format
   * @param eventIds - Array of event indentifiers in string format
   * @param requestId - Request identifier for API logger
   * @returns Promise of EventDto array
   */
  async getEventListByEventsIds(
    eventIds: string[],
    requestId?: string,
  ): Promise<EventDto[]> {
    try {
      this.logger.info(
        `[EventRepository] [getEventListByEventsIds] - x-request-id:${requestId}`,
      );

      const events: EventSchema[] = await this.findByEventIds(eventIds);

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
        `[EventRepository] [getEventListByEventsIds] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Return single event related to ID provided
   * @param eventId - Event identifier
   * @param requestId - Request identifier for API logger
   * @returns Promise of EventDto
   */
  async getEvent(eventId: string, requestId?: string): Promise<EventDto> {
    try {
      this.logger.info(
        `[EventRepository] [getEvent] - x-request-id: ${requestId}`,
      );

      const event = await this.findOneById(eventId);

      if (!event) throw new DataBaseNotFoundError();

      const eventDto: EventDto = plainToClass(EventDto, event, {
        excludeExtraneousValues: true,
      });

      validateObjectDto(eventDto, REQUIRED_DTO_FIELDS.EVENTS);

      return eventDto;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEvent] - x-request-id: ${requestId}, error: ${error}`,
      );

      // In case eventId is malformed from db side for char length
      if (error.path === '_id') throw new DataBaseNotFoundError();

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove the event document matches with the ID provided
   * @param eventId - Event identifier
   * @param requestId - Request identifier for API logger
   */
  async removeEvent(eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[EventRepository] [removeEvent] - x-request-id:${requestId}, eventId ${eventId}`,
      );

      await this.removeById(eventId);
    } catch (error) {
      this.logger.error(
        `[EventRepository] [removeEvent] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
