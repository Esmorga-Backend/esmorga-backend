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

      const isRegistered = await this.accountRepository.findUserByEmail(
        email,
        requestId,
      );
      if (isRegistered) {
        const verificationCode = generateVerificationCode();
        console.log(
          '>>****>>>***>>>> CÓDIGO DE VERIFICACIÓN:',
          verificationCode,
        );
        this.verificationCodeRepository.sendVerificationCode(
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
