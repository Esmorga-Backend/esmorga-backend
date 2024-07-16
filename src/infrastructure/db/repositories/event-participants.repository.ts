import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { EventParticipants as EventParticipantschema } from '../schema';

@Injectable()
export class EventParticipantsRepository extends MongoRepository<EventParticipantschema> {
  constructor(
    @InjectModel(EventParticipantschema.name)
    private eventParticipantsModel: Model<EventParticipantschema>,
    private readonly logger: PinoLogger,
  ) {
    super(eventParticipantsModel);
  }

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

      throw error;
    }
  }
}
