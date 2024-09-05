import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { TemporalCodeRepository } from '../../../infrastructure/db/repositories';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';

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

      throw error;
    }
  }
}
