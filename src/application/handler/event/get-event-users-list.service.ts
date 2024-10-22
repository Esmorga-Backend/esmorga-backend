import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  TokensRepository,
  EventParticipantsRepository,
} from '../../../infrastructure/db/repositories';
import { ACCOUNT_ROLES } from '../../../domain/const';
import { NotAdminAccountApiError } from '../../../domain/errors';
import {
  EventParticipantsDto,
  UserListDto,
} from '../../../infrastructure/dtos';

@Injectable()
export class GetEventUsersListService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
  ) {}

  /**
   * Provide a list of users  who have joined the event.
   *
   * @returns - Object containing the total number of joined users and the list of their names.
   */
  async getUsers(
    sessionId: string,
    eventId: string,
    requestId?: string,
  ): Promise<UserListDto> {
    try {
      this.logger.info(
        `[GetEventUsersListService] [getUsers] - x-request-id: ${requestId}, eventId ${eventId}`,
      );

      const { uuid } = await this.tokensRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const { role } = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (role !== ACCOUNT_ROLES.ADMIN) throw new NotAdminAccountApiError();

      const participantList: EventParticipantsDto =
        await this.eventParticipantsRepository.getEventParticipantList(
          eventId,
          requestId,
        );

      const participantNames = await this.accountRepository.getUserNames(
        participantList.participants,
        requestId,
      );

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

      throw error;
    }
  }
}
