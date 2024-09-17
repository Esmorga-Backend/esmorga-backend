import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../infrastructure/db/repositories';
import {
  generateTemporalCode,
  GenerateMailService,
} from '../../../domain/services';
import { NodemailerService } from '../../../infrastructure/services';
import { ACCOUNT_STATUS, TEMPORAL_CODE_TYPE } from '../../../domain/const';

@Injectable()
export class SendEmailVerificationService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly temporalCodeRepository: TemporalCodeRepository,
    private readonly generateMailService: GenerateMailService,
    private readonly nodemailerService: NodemailerService,
  ) {}
  /**
   * Sends a verification email if the account is registered but not ACTIVE or BLOCKED.
   *
   * @param email - User email.
   * @param requestId - Request identifier.
   */
  async sendEmailVerification(email: string, requestId?: string) {
    try {
      this.logger.info(
        `[SendEmailVerificationService] [sendEmailVerification] - x-request-id:${requestId}, email: ${email}`,
      );

      const isRegistered = await this.accountRepository.accountExist(
        email,
        requestId,
      );

      if (
        isRegistered &&
        isRegistered.status !== ACCOUNT_STATUS.ACTIVE &&
        isRegistered.status !== ACCOUNT_STATUS.BLOCKED
      ) {
        const verificationCode = generateTemporalCode();

        await this.temporalCodeRepository.saveCode(
          verificationCode,
          TEMPORAL_CODE_TYPE.VERIFICATION,
          email,
          requestId,
        );

        const { from, subject, html } =
          this.generateMailService.getVerificationEmail(verificationCode);

        this.nodemailerService.sendEmail(email, from, subject, html, requestId);
      }
    } catch (error) {
      this.logger.error(
        `[SendEmailVerificationService] [sendEmailVerification] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
