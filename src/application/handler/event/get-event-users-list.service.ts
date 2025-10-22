import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  SessionRepository,
  EventParticipantsRepository,
  EventRepository,
} from '../../../infrastructure/db/repositories';
import { NotFoundEventIdApiError } from '../../../domain/errors';
import {
  EventParticipantsDto,
  UserListDto,
} from '../../../infrastructure/dtos';
import { DataBaseBadRequestError } from '../../../infrastructure/db/errors';

@Injectable()
export class GetEventUsersListService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
    private readonly eventRepository: EventRepository,
  ) {}

  /**
   * Provide a list of users  who have joined the event.
   *
   * @returns - Object containing the total number of joined users and the list of their names.
   * @throws NotAdminAccountApiError - User is not admin.
   * @throws NotFoundEventIdApiError - EventId is not valid following DB schema ot not found.
   */
  async getUsersList(
    eventId: string,
    requestId?: string,
  ): Promise<UserListDto> {
    try {
      this.logger.info(
        `[GetEventUsersListService] [getUsers] - x-request-id: ${requestId}, eventId ${eventId}`,
      );

      await this.eventRepository.findOneByEventId(eventId);

      const participantList: EventParticipantsDto =
        await this.eventParticipantsRepository.getEventParticipantList(
          eventId,
          requestId,
        );

      const participantNames = participantList
        ? await this.accountRepository.getUserNames(
            participantList.participants,
            requestId,
          )
        : [];

      const sortedParticipantNames = participantNames.sort((a, b) =>
        a.localeCompare(b),
      );

      return {
        totalUsers: participantNames.length,
        users: sortedParticipantNames,
      };
    } catch (error) {
      this.logger.error(
        `[GetEventUsersListService] [getUsers] - x-request-id: ${requestId}, error: ${error}`,
      );
      if (error instanceof DataBaseBadRequestError) {
        throw new NotFoundEventIdApiError();
      }

      throw error;
    }
  }
}
