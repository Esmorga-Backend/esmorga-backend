import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { EventDto } from '../../../infrastructure/dtos';
import { UpdateEventDto } from '../../../infrastructure/http/dtos';
import { USER_ROLES } from '../../../domain/consts';
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

      if (role !== USER_ROLES.ADMIN) throw new InvalidRoleApiError();

      const { eventId } = updateEventDto;

      const existingEvent = await this.eventRepository.findOneByEventId(
        eventId,
        requestId,
      );

      if (updateEventDto.location) {
        updateEventDto.location = {
          ...existingEvent.location,
          ...updateEventDto.location,
        };
      }

      const updatedEvent = await this.eventRepository.updateEvent(
        uuid,
        eventId,
        updateEventDto,
        requestId,
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
