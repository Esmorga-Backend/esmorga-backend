import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  VerificationCodeRepository,
} from '../../../infrastructure/db/repositories';
import {
  generateVerificationCode,
  GenerateMailService,
} from '../../../domain/services';
import { NodemailerService } from '../../../infrastructure/services';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly generateMailService: GenerateMailService,
    private readonly nodemailerService: NodemailerService,
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

        await this.verificationCodeRepository.saveVerificationCode(
          email,
          verificationCode,
          requestId,
        );

        const { from, subject, html } =
          this.generateMailService.getVerificationEmail(verificationCode);

        await this.nodemailerService.sendEmail(
          email,
          from,
          subject,
          html,
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
