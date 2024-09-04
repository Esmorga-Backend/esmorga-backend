import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class ActivateAccount {
  constructor(private readonly logger: PinoLogger) {}

  async activate(verificationCode: string, requestId?: string) {
    try {
      this.logger.info(
        `[ActivateAccount] [activate] - x-request-id: ${requestId}`,
      );
    } catch (error) {
      this.logger.error(
        `[ActivateAccount] [activate] - x-request-id: ${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
