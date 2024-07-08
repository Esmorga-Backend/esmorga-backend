import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  DataBaseUnathorizedError,
  DataBaseNotFoundError,
} from '../../../infrastructure/db/errors';
import {
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  BadEventIdApiError,
  InvalidTokenApiError,
  NotAccepteableEventApiError,
} from '../../../domain/errors';

@Injectable()
export class JoinEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly tokensRepository: TokensRepository,
  ) {}

  async joinEvent(accessToken: string, eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[JoinEventService] [joinEvent] - x-request-id:${requestId}, eventId ${eventId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      const { eventDate } = await this.eventRepository.getEvent(
        eventId,
        requestId,
      );

      if (eventDate < new Date()) throw new NotAccepteableEventApiError();
    } catch (error) {
      this.logger.error(
        `[JoinEventService] [joinEvent] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      if (error instanceof DataBaseNotFoundError)
        throw new BadEventIdApiError();

      throw error;
    }
  }
}
