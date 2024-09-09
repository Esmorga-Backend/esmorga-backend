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

      const { email } = await this.temporalCodeRepository.getCode(
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

      // TODO delete forgotPasswordCode used
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
