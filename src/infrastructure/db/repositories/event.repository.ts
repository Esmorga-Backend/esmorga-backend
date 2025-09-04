import { HttpException, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto, EventWithCreatorFlagDto } from '../../dtos';
import { CreateEventDto } from '../../http/dtos';
import {
  DataBaseBadRequestError,
  DataBaseInternalError,
  DataBaseNotFoundError,
} from '../errors';
import { validateObjectDto } from '../utils';
import { REQUIRED_DTO_FIELDS } from '../consts';
import { EventDA } from '../modules/none/event-da';

@Injectable()
export class EventRepository {
  constructor(
    private readonly eventDA: EventDA,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Store a new event document.
   *
   * @param createEventDto - Event data provided.
   * @param requestId - Request identifier for API logger.
   */
  async createEvent(
    createEventDto: CreateEventDto,
    email: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[EventRepository] [createEvent] - x-request-id: ${requestId}`,
      );

      await this.eventDA.create(createEventDto, email);
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
      const event = await this.eventDA.findOneById(eventId);
      if (!event) throw new DataBaseBadRequestError();
      validateObjectDto(event, REQUIRED_DTO_FIELDS.UPDATE_EVENT);
      return event;
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
      const events = await this.eventDA.find();
      events.forEach((event) => {
        validateObjectDto(event, REQUIRED_DTO_FIELDS.EVENTS);
      });
      return events;
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

      const updatedEvent = await this.eventDA.updateById(eventId, {
        ...fieldsToUpdate,
        updatedBy: uuid,
      });
      validateObjectDto(updatedEvent, REQUIRED_DTO_FIELDS.EVENTS);
      return updatedEvent;
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
      const events = await this.eventDA.findByEventIds(eventIds);
      events.forEach((event) => {
        validateObjectDto(event, REQUIRED_DTO_FIELDS.EVENTS);
      });
      return events;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEventListByEventsIds] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Return single event related to email provided
   * @param email - User email
   * @param requestId - Request identifier for API logger
   * @returns Promise of EventWithCreatorFlagDto
   */
  async getEventsCreatedByEmail(email: string, requestId?: string): Promise<EventWithCreatorFlagDto[]> {
    try {
      this.logger.info(
        `[EventRepository] [getEventsCreatedByEmail] - x-request-id: ${requestId}, email: ${email}`,
      );
      const events = await this.eventDA.findByEmail(email);
      events.forEach((event) => {
        validateObjectDto(event, REQUIRED_DTO_FIELDS.EVENTS);
      });
      return events;
    } catch (error) {
      this.logger.error(
        `[EventRepository] [getEventsCreatedByEmail] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

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
      const event = await this.eventDA.findOneById(eventId);
      if (!event) throw new DataBaseNotFoundError();
      validateObjectDto(event, REQUIRED_DTO_FIELDS.EVENTS);
      return event;
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
        `[EventRepository] [removeEvent] - x-request-id: ${requestId}, eventId: ${eventId}`,
      );
      await this.eventDA.removeById(eventId);
    } catch (error) {
      this.logger.error(
        `[EventRepository] [removeEvent] - x-request-id: ${requestId}, error: ${error}`,
      );
      throw new DataBaseInternalError();
    }
  }
}
