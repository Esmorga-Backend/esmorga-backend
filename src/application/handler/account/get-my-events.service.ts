import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';

@Injectable()
export class GetMyEventsService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly tokensRepository: TokensRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  async getEvents(accessToken: string, requestId: string) {
    try {
      this.logger.info(
        `[GetMyEventsService] [getEvents] - x-request-id: ${requestId}, eventId ${eventId}`,
      );
    } catch (error) {
      this.logger.error(
        `[GetMyEventsService] [getEvents] - x-request-id: ${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
