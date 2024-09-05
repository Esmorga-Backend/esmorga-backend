import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { TemporalCodeRepository } from '../../../infrastructure/db/repositories';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';
import { DataBaseNotFoundError } from '../../../infrastructure/db/errors';
import { InvalidVerificationCodeApiError } from '../../../domain/errors';

@Injectable()
export class ActivateAccount {
  constructor(
    private readonly logger: PinoLogger,
    private readonly temporalCodeRepository: TemporalCodeRepository,
  ) {}

  async activate(verificationCode: string, requestId?: string) {
    try {
      this.logger.info(
        `[ActivateAccount] [activate] - x-request-id: ${requestId}`,
      );

      const code = parseInt(verificationCode);

      const { email } = await this.temporalCodeRepository.getCode(
        code,
        TEMPORAL_CODE_TYPE.VERIFICATION,
        requestId,
      );
    } catch (error) {
      this.logger.error(
        `[ActivateAccount] [activate] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseNotFoundError) {
        throw new InvalidVerificationCodeApiError();
      }

      throw error;
    }
  }
}
