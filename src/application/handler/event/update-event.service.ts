import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { UpdateEventDto } from '../../../infrastructure/http/dtos';
import {
  DataBaseBadRequestError,
  DataBaseForbiddenError,
  DataBaseUnathorizedError,
} from '../../../infrastructure/db/errors';
import {
  AccountRepository,
  EventRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import { EventDto } from '../../../infrastructure/dtos';
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
    // ): Promise<EventDto> {
  ) {
    try {
      this.logger.info(
        `[UpdateEventService] [update] - x-request-id:${requestId}`,
      );

      const { eventId } = updateEventDto;

      //TODO - El evento existe ✅
      const eventToUpdate = await this.eventRepository.findOneByEventId(
        eventId,
        requestId,
      );

      //TODO - El accessToken existe ✅
      const { uuid } = await this.tokensRepository.getTokenDataByAccessToken(
        accessToken,
        requestId,
      );

      //TODO - Si es admin o que ✅
      await this.accountRepository.checkRoleById(uuid, requestId);

      //TODO - Mandar la info del nuevo evento
      const updatedEvent =
        await this.eventRepository.updateEvent(eventToUpdate);
      return updatedEvent;
    } catch (error) {
      this.logger.error(
        `[UpdateEventService] [update] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseBadRequestError)
        //TODO: este luego lo cambio por el que tiene Abrodos hecho
        throw new InvalidEventIdApiError();

      if (error instanceof DataBaseForbiddenError)
        throw new InvalidRoleApiError();

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
