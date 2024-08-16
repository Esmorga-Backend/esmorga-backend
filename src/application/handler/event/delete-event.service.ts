import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  EventRepository,
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import { USER_ROLES } from '../../../domain/const';
import {
  NotAdminAccountApiError,
  InvalidEventIdApiError,
} from '../../../domain/errors';
import { DataBaseNotFoundError } from '../../../infrastructure/db/errors';

@Injectable()
export class DeleteEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly eventRepository: EventRepository,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  /**
   * Remove the event document and event participant list that matches with the ID provided.
   *
   * @param accessToken - Token allows user a method to authenticate.
   * @param eventId - Event identifier.
   * @param requestId - Request identifier.
   * @throws NotAdminAccountApiError - User is not admin.
   * @throws InvalidEventIdApiError - EventId is not valid follwing DB schema ot not found.
   */
  async delete(accessToken: string, eventId: string, requestId?: string) {
    try {
      this.logger.info(
        `[DeleteEventService] [delete] - x-request-id: ${requestId}, eventId: ${eventId}`,
      );

      await this.eventRepository.getEvent(eventId, requestId);

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      const { role } = await this.accountRepository.getUserById(
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

      if (error instanceof DataBaseNotFoundError)
        throw new InvalidEventIdApiError();

      throw error;
    }
  }
}
