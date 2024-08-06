import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  EventRepository,
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import { USER_ROLES } from '../../../domain/const';
import { NotAdminAccountApiError } from '../../../domain/errors';

@Injectable()
export class DeleteEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  async delete(accessToken: string, eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[DeleteEventService] [delete] - x-request-id:${requestId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      const { role } = await this.accountRepository.getUserByUuid(
        uuid,
        requestId,
      );

      if (role !== USER_ROLES.ADMIN) throw new NotAdminAccountApiError();

      await this.eventRepository.removeEvent(eventId, requestId);

      await this.eventParticipantsRepository.removeEventParticipantByEventId(
        eventId,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[DeleteEventService] [delete] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
