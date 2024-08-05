import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { JoinEventDto } from '../../../infrastructure/http/dtos';
import {
  EventRepository,
  AccountRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';

@Injectable()
export class DeleteEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
  ) {}

  async delete(
    accessToken: string,
    joinEventDto: JoinEventDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[DeleteEventService] [delete] - x-request-id:${requestId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      console.log({ uuid });
    } catch (error) {
      this.logger.error(
        `[DeleteEventService] [delete] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
