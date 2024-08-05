import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../../infrastructure/dtos';
import { UpdateEventDto } from '../../../infrastructure/http/dtos';
import { USER_ROLE } from '../../../domain/user-const';
import {
  DataBaseBadRequestError,
  DataBaseUnathorizedError,
} from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import {
  InvalidEventIdApiError,
  InvalidRoleApiError,
  InvalidTokenApiError,
} from '../../../domain/errors';

@Injectable()
export class UpdateEventService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly eventRepository: EventRepository,
    private readonly tokensRepository: TokensRepository,
  ) {}

  /**
   * Update an event.
   *
   * @param accesToken - The accesToken to authorise.
   * @param updateEventDto - Data transfer object containing event details.
   * @param requestId - The request ID for loggers.
   */
  async update(
    accessToken: string,
    updateEventDto: UpdateEventDto,
    requestId?: string,
  ): Promise<EventDto> {
    try {
      this.logger.info(
        `[UpdateEventService] [update] - x-request-id:${requestId}`,
      );

      const { uuid } = await this.tokensRepository.getPairOfTokensByAccessToken(
        accessToken,
        requestId,
      );

      const { role } = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (role !== USER_ROLE.ADMIN) throw new InvalidRoleApiError();

      const { eventId } = updateEventDto;

      await this.eventRepository.findOneByEventId(eventId, requestId);

      const updatedEvent = await this.eventRepository.updateEvent(
        uuid,
        eventId,
        updateEventDto,
      );
      return updatedEvent;
    } catch (error) {
      this.logger.error(
        `[UpdateEventService] [update] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseBadRequestError)
        throw new InvalidEventIdApiError();

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
