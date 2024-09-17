import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import {
  encodeValue,
  generateTemporalCode,
  GenerateMailService,
} from '../../../domain/services';
import {
  AccountRepository,
  TemporalCodeRepository,
} from '../../../infrastructure/db/repositories';
import { NodemailerService } from '../../../infrastructure/services';
import { TEMPORAL_CODE_TYPE } from '../../../domain/const';

@Injectable()
export class RegisterService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly generateMailService: GenerateMailService,
    private readonly nodemailerService: NodemailerService,
    private readonly accountRepository: AccountRepository,
    private readonly temporalCodeRepository: TemporalCodeRepository,
  ) {}

  /**
   * Create a new user and provide a new pair of tokens and profile information.
   *
   * @param accountRegisterDto - DTO with registration data to create a new user.
   * @param requestId - Request identifier.
   */
  async register(accountRegisterDto: AccountRegisterDto, requestId?: string) {
    try {
      const { email, password } = accountRegisterDto;

      this.logger.info(
        `[RegisterService] [register] - x-request-id: ${requestId}, email: ${email}`,
      );

      const exists = await this.accountRepository.accountExist(
        email,
        requestId,
      );

      if (!exists) {
        const hashPassword = await encodeValue(password);

        accountRegisterDto.password = hashPassword;

        await this.accountRepository.saveUser(accountRegisterDto, requestId);

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
        `[RegisterService] [register] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
