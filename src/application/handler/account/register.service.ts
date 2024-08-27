import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import { encodeValue } from '../../../domain/services';
import { AccountRepository } from '../../../infrastructure/db/repositories';

@Injectable()
export class RegisterService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
  ) {}

  /**
   * Create a new user and provide a new pair of tokens and profile information.
   * @param accountRegisterDto - DTO with registration data to create a new user.
   * @param requestId - Request identifier
   * @returns AccountLoggedDto - Object with new pair of tokens and profile data
   * @throws EmailConflictApiError - Email provided exists in the database.
   */
  async register(accountRegisterDto: AccountRegisterDto, requestId?: string) {
    try {
      const { email, password } = accountRegisterDto;

      this.logger.info(
        `[RegisterService] [register] - x-request-id:${requestId}, email ${email}`,
      );

      const exists = await this.accountRepository.accountExist(
        email,
        requestId,
      );

      if (!exists) {
        const hashPassword = await encodeValue(password);

        accountRegisterDto.password = hashPassword;
      }

      await this.accountRepository.saveUser(accountRegisterDto, requestId);
    } catch (error) {
      this.logger.error(
        `[RegisterService] [register] - x-request-id:${requestId}, error ${error}`,
      );

      throw error;
    }
  }
}
