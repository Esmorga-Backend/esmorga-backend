import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../infrastructure/db/repositories';
import { UpdatePasswordDto } from '../../../infrastructure/http/dtos';
import { encodeValue } from '../../../domain/services';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';
import { DataBaseNotFoundError } from '../../../infrastructure/db/errors';
import { InvalidForgotPasswordCodeApiError } from '../../../domain/errors';

@Injectable()
export class UpdatePasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly temporalCodeRepository: TemporalCodeRepository,
  ) {}

  /**
   * Update account password related to code provided.
   *
   * @param updatePasswordDto - DTO that contains the new password and code to exchange.
   * @param requestId - Request identifier for API logger.
   * @throws InvalidForgotPasswordCodeApiError - Error for invalid/expired/used code.
   */
  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[UpdatePasswordService] [updatePassword] - x-request-id: ${requestId}`,
      );

      const { password, forgotPasswordCode } = updatePasswordDto;

      const code = parseInt(forgotPasswordCode);

      if (!code) {
        throw new InvalidForgotPasswordCodeApiError();
      }

      const { id, email } = await this.temporalCodeRepository.getCode(
        code,
        TEMPORAL_CODE_TYPE.FORGOT_PASSWORD,
        requestId,
      );

      const hashPassword = await encodeValue(password);

      await this.accountRepository.updateAccountPassword(
        email,
        hashPassword,
        requestId,
      );

      await this.temporalCodeRepository.removeCodeById(id, requestId);
    } catch (error) {
      this.logger.error(
        `[UpdatePasswordService] [updatePassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof DataBaseNotFoundError) {
        throw new InvalidForgotPasswordCodeApiError();
      }

      throw error;
    }
  }
}
