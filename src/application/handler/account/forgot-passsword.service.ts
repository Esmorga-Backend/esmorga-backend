import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  VerificationCodeRepository,
} from '../../../infrastructure/db/repositories';
import { generateVerificationCode } from '../../../domain/services';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly verificationCodeRepository: VerificationCodeRepository,
  ) {}
  //TODO: METER COMENTARIO DE LA FUNCIÓN
  async forgotPassword(email: string, requestId?: string) {
    try {
      this.logger.info(
        `[ForgotPasswordService] [forgotPassword] - x-request-id:${requestId}, email: ${email}`,
      );

      const isRegistered = await this.accountRepository.accountExist(
        email,
        requestId,
      );

      if (isRegistered) {
        const verificationCode = generateVerificationCode();

        this.verificationCodeRepository.saveVerificationCode(
          email,
          verificationCode,
          requestId,
        );
      }
    } catch (error) {
      this.logger.error(
        `[ForgotPasswordService] [forgotPassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
