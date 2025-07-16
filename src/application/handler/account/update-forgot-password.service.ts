import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  LoginAttemptsRepository,
  TemporalCodeRepository,
} from '../../../infrastructure/db/repositories';
import { UpdateForgotPasswordDto } from '../../../infrastructure/http/dtos';
import { encodeValue } from '../../../domain/services';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';
import { DataBaseNotFoundError } from '../../../infrastructure/db/errors';
import { InvalidForgotPasswordCodeApiError } from '../../../domain/errors';

@Injectable()
export class UpdateForgotPasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly temporalCodeRepository: TemporalCodeRepository,
    private readonly loginAttemptsRepository: LoginAttemptsRepository,
  ) {}

  /**
   * Update account password related to code provided.
   *
   * @param updateForgotPasswordDto - DTO that contains the new password and code to exchange.
   * @param requestId - Request identifier for API logger.
   * @throws InvalidForgotPasswordCodeApiError - Error for invalid/expired/used code.
   */
  async updatePassword(
    updateForgotPasswordDto: UpdateForgotPasswordDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[UpdateForgotPasswordService] [updatePassword] - x-request-id: ${requestId}`,
      );

      const { password, forgotPasswordCode } = updateForgotPasswordDto;

      const { id, email } = await this.temporalCodeRepository.getCode(
        forgotPasswordCode,
        TEMPORAL_CODE_TYPE.FORGOT_PASSWORD,
        requestId,
      );

      const hashPassword = await encodeValue(password);

      const { uuid } = await this.accountRepository.updateAccountForgotPassword(
        email,
        hashPassword,
        requestId,
      );

      await this.temporalCodeRepository.removeCodeById(id, requestId);
      await this.loginAttemptsRepository.removeLoginAttempts(uuid, requestId);
    } catch (error) {
      this.logger.error(
        `[UpdateForgotPasswordService] [updatePassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseNotFoundError) {
        throw new InvalidForgotPasswordCodeApiError();
      }

      throw error;
    }
  }
}
