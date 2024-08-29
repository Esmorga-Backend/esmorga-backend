import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import {
  encodeValue,
  generateCode,
  GenerateMailService,
} from '../../../domain/services';
import {
  AccountRepository,
  VerificationCodeRepository,
} from '../../../infrastructure/db/repositories';
import { NodemailerService } from '../../../infrastructure/services';
@Injectable()
export class RegisterService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly generateMailService: GenerateMailService,
    private readonly nodemailerService: NodemailerService,
    private readonly accountRepository: AccountRepository,
    private readonly veririficationCodeRepository: VerificationCodeRepository,
  ) {}

  /**
   * Create a new user and provide a new pair of tokens and profile information.
   * @param accountRegisterDto - DTO with registration data to create a new user.
   * @param requestId - Request identifier
   * @throws EmailConflictApiError - Email provided exists in the database.
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

        const verificationCode = generateCode();

        await this.veririficationCodeRepository.saveCode(
          verificationCode,
          email,
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
        `[RegisterService] [register] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
