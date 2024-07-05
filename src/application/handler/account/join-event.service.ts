import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import { InvalidTokenApiError } from '../../../domain/errors';

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
        `[LoginService] [joinEvent] - x-request-id:${requestId}, eventId ${eventId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );
      console.log({ uuid });
    } catch (error) {
      this.logger.error(
        `[LoginService] [joinEvent] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
