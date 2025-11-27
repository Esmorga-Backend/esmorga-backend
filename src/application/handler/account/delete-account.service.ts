import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  SessionRepository,
  AccountRepository,
  EventParticipantsRepository,
  PollRepository,
} from '../../../infrastructure/db/repositories';
import { DeleteAccountDto } from '../../../infrastructure/http/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import {
  InvalidTokenApiError,
  InvalidPasswordError,
} from '../../../domain/errors';
import { verifyHashedValue } from '../../../domain/services';
@Injectable()
export class DeleteAccountService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly sessionRepository: SessionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly eventParticipantsRepository: EventParticipantsRepository,
    private readonly pollRepository: PollRepository,
  ) {}

  /**
   * Delete the account associated with the given session ID.
   *
   * @param sessionId - Client session id.
   * @param deleteAccountDto - DTO that contains the account password.
   * @param requestId - Request identifier.
   * @throws InvalidTokenApiError - No user found for the current session.
   */
  async deleteAccount(
    sessionId: string,
    deleteAccountDto: DeleteAccountDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[DeleteAccountService] [deleteAccount] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const profilePasswordHashed =
        await this.accountRepository.getCurrentPasswordByUuid(uuid, requestId);

      const doPasswordsMatch = await verifyHashedValue(
        profilePasswordHashed,
        deleteAccountDto.password,
      );

      if (!doPasswordsMatch) throw new InvalidPasswordError();

      await this.eventParticipantsRepository.removeUserFromAllEvents(
        uuid,
        requestId,
      );

      await this.pollRepository.removeUserFromAllPolls(uuid, requestId);

      await this.sessionRepository.removeAllSessionsByUuid(
        uuid,
        null,
        requestId,
      );

      await this.accountRepository.deleteAccountByUuid(uuid, requestId);
    } catch (error) {
      this.logger.error(
        `[DeleteAccountService] [deleteAccount] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
