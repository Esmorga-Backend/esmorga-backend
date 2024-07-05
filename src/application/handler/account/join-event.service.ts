import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  DataBaseUnathorizedError,
  DataBaseNotFoundError,
} from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  BadEventIdApiError,
  InvalidTokenApiError,
} from '../../../domain/errors';

@Injectable()
export class JoinEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
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

      const event = await this.eventRepository.getEvent(eventId, requestId);
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
