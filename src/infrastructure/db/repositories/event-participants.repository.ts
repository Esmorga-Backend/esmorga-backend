import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { plainToClass } from 'class-transformer';
import { MongoRepository } from './mongo.repository';
import { EventParticipants as EventParticipantschema } from '../schema';
import { EventParticipantsDto } from '../../dtos';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class EventParticipantsRepository extends MongoRepository<EventParticipantschema> {
  constructor(
    @InjectModel(EventParticipantschema.name)
    private eventParticipantsModel: Model<EventParticipantschema>,
    private readonly logger: PinoLogger,
  ) {
    super(eventParticipantsModel);
  }

  /**
   * Add the user ID to the event participant list
   * @param eventId - Event identifier
   * @param userId - User identifier
   * @param requestId - Request identifier for API logger
   */
  async updateParticipantList(
    eventId: string,
    userId: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [updateParticipantList] - x-request-id: ${requestId}, eventId: ${eventId}, userId: ${userId}`,
      );

      await this.findAndUpdateParticipantsList(eventId, userId);
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [updateParticipantList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async removeEventParticipantByEventId(eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [removeEventParticipant] - x-request-id:${requestId}, eventId ${eventId}`,
      );

      await this.removeByEventId(eventId);
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [removeEventParticipant] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Return the event IDs the user has joined as participant
   * @param userId - User identifier
   * @param requestId - Request identifier for API logger
   * @returns Array of strings with the event IDs the user joined
   */
  async getEventsJoined(userId: string, requestId?: string): Promise<string[]> {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [getEventParticipant] - x-request-id: ${requestId}, userId: ${userId}`,
      );

      const eventParticipantsDb: EventParticipantschema[] =
        await this.findEventParticipant(userId);

      const eventIdJoined: string[] = eventParticipantsDb.map(
        (singleEventParticipanstDb) => {
          const eventParticipants: EventParticipantsDto = plainToClass(
            EventParticipantsDto,
            singleEventParticipanstDb,
            {
              excludeExtraneousValues: true,
            },
          );

          return eventParticipants.eventId;
        },
      );

      return eventIdJoined;
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [getEventParticipant] - x-request-id: ${requestId}, error: ${error}`,
      );
    }
  }

  async disjoinParticipantList(
    eventId: string,
    userId: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[EventParticipantsRepository] [disjoinParticipantList] - x-request-id: ${requestId}, eventId: ${eventId}, userId: ${userId}`,
      );

      await this.removePartipantFromList(eventId, userId);
    } catch (error) {
      this.logger.error(
        `[EventParticipantsRepository] [disjoinParticipantList] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
