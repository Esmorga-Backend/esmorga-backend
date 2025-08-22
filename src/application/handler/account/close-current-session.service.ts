import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { SessionRepository } from '../../../infrastructure/db/repositories';
@Injectable()
export class CloseCurrentSessionService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly sessionRepository: SessionRepository,
  ) {}

  /**
   * Remove the session document that matches with the session ID provided.
   *
   * @param sessionId - Client session id.
   * @param requestId - Request identifier.
   * @throws InvalidTokenApiError - No user found for the current session.
   */
  async delete(sessionId: string, requestId?: string) {
    try {
      this.logger.info(
        `[CloseCurrentSessionService] [delete] - x-request-id: ${requestId}`,
      );

      await this.sessionRepository.removeTokensBySessionId(
        sessionId,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[CloseCurrentSessionService] [delete] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
