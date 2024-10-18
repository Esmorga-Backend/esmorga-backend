import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError } from '../errors';
import { LoginAttemptsDA } from '../modules/none/login-attempts-da';

@Injectable()
export class LoginAttemptsRepository {
  constructor(
    private readonly loginAttemptsDA: LoginAttemptsDA,
    private readonly logger: PinoLogger,
  ) {}

  /**
   * Updates the login attempts for a user identified by the uuid.
   *
   * @param uuid - User identifier.
   * @param requestId - Request identifier.
   * @returns The updated number of login attempts.
   */
  async updateLoginAttempts(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[LoginAttemptsRepository] [updateLoginAttempts] - x-request-id: ${requestId}`,
      );

      return await this.loginAttemptsDA.findAndUpdateLoginAttempts(uuid);
    } catch (error) {
      this.logger.error(
        `[LoginAttemptsRepository] [updateLoginAttempts] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Removes the login attempts for a user identified by the uuid.
   *
   * @param uuid - User identifier.
   * @param requestId - Request identifier.
   */
  async removeLoginAttempts(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[LoginAttemptsRepository] [removeLoginAttempts] - x-request-id: ${requestId}`,
      );

      await this.loginAttemptsDA.removeByUuid(uuid);
    } catch (error) {
      this.logger.error(
        `[LoginAttemptsRepository] [removeLoginAttempts] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
