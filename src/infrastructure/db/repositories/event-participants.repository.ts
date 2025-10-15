import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError } from '../errors';
import { EventParticipantsDA } from '../modules/none/event-participant-da';
import { EventParticipantsDto } from '../../dtos';

@Injectable()
export class EventParticipantsRepository {
  constructor(
    private eventParticipantDA: EventParticipantsDA,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Add the user ID to the event participant list.
   *
   * @param eventId - Event identifier.
   * @param userId - User identifier.
   * @param requestId - Request identifier for API logger.
   */
  async updateParticipantList(
    eventId: string,
    userId: string,
    requestId?: string,
  ): Promise<boolean> {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [updateParticipantList] - x-request-id: ${requestId}, eventId: ${eventId}, userId: ${userId}`,
      );

      return this.eventParticipantDA.findAndUpdateParticipantsList(
        eventId,
        userId,
      );
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [updateParticipantList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove document by id
   *
   * @param eventId - Event identifier.
   * @param requestId - Request identifier for API logger.
   */
  async removeEventParticipantByEventId(eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [removeEventParticipant] - x-request-id:${requestId}, eventId ${eventId}`,
      );

      await this.eventParticipantDA.removeByEventId(eventId);
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [removeEventParticipant] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Return the event IDs the user has joined as participant.
   *
   * @param userId - User identifier.
   * @param requestId - Request identifier for API logger.
   * @returns Array of strings with the event IDs the user joined.
   */
  async getEventsJoined(userId: string, requestId?: string): Promise<string[]> {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [getEventParticipant] - x-request-id: ${requestId}, userId: ${userId}`,
      );
      return await this.eventParticipantDA.findEventParticipant(userId);
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [getEventParticipant] - x-request-id: ${requestId}, error: ${error}`,
      );
    }
  }

  /**
   *  Remove user from the event participant list.
   *
   * @param eventId - Event identifier.
   * @param userId - User identifier.
   * @param requestId - Request identifier for API logger.
   */
  async disjoinParticipantList(
    eventId: string,
    userId: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [disjoinParticipantList] - x-request-id: ${requestId}, eventId: ${eventId}, userId: ${userId}`,
      );

      await this.eventParticipantDA.removeParticipantFromList(eventId, userId);
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [disjoinParticipantList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }

  /**
   * Return all the events with the participants.
   *
   * @param requestId - Request identifier for API logger.
   * @returns The data of the participants of all events.
   */
  async getAllEventsParticipantList(
    eventId: string,
    requestId?: string,
  ): Promise<EventParticipantsDto[]> {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [getAllEventsParticipantList] - x-request-id: ${requestId}, eventId: ${eventId}`,
      );
      const events: EventParticipantsDto[] =
        await this.eventParticipantDA.find();
      return events;
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [getAllEventsParticipantList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }

  /**
   * Return the event with the participants.
   *
   * @param eventId - Event identifier.
   * @param requestId - Request identifier for API logger.
   * @returns The data of the participants who have joined the eventId provided.
   */
  async getEventParticipantList(
    eventId: string,
    requestId?: string,
  ): Promise<EventParticipantsDto> {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [getEventParticipantsList] - x-request-id: ${requestId}, eventId: ${eventId}`,
      );
      const event: EventParticipantsDto =
        await this.eventParticipantDA.findEvent(eventId);

      return event;
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [getEventParticipantsList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
