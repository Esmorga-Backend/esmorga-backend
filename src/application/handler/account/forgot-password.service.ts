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
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly generateMailService: GenerateMailService,
    private readonly nodemailerService: NodemailerService,
    private readonly temporalCodeRepository: TemporalCodeRepository,
  ) {}
  /**
   * Allow to send an email to change the user password.
   *
   * @param email - DTO with registration data to create a new user.
   * @param requestId - Request identifier.
   */
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
        const temporalCode = generateTemporalCode();

        await this.temporalCodeRepository.saveCode(
          temporalCode,
          TEMPORAL_CODE_TYPE.FORGOT_PASSWORD,
          email,
          requestId,
        );

        const { from, subject, html } =
          this.generateMailService.getForgotPasswordEmail(temporalCode);

        this.nodemailerService.sendEmail(email, from, subject, html, requestId);
      }
    } catch (error) {
      this.logger.error(
        `[ForgotPasswordService] [forgotPassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
