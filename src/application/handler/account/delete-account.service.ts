import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  SessionRepository,
  AccountRepository,
} from '../../../infrastructure/db/repositories';
import { DeleteAccountDto } from '../../../infrastructure/http/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { InvalidTokenApiError } from '../../../domain/errors';

@Injectable()
export class DeleteAccountService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly sessionRepository: SessionRepository,
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * Delete the account associated with the given session ID.
   *
   * @param sessionId - Client session id.
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
