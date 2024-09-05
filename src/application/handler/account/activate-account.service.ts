import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { VerificationCodeRepository } from '../../../infrastructure/db/repositories';

@Injectable()
export class ActivateAccount {
  constructor(
    private readonly logger: PinoLogger,
    private readonly verificationCodeRepository: VerificationCodeRepository,
  ) {}

  async activate(verificationCode: string, requestId?: string) {
    try {
      this.logger.info(
        `[ActivateAccount] [activate] - x-request-id: ${requestId}`,
      );

      const { email } = await this.verificationCodeRepository.getCode(
        verificationCode,
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
