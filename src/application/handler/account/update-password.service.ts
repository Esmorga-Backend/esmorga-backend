import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import {
  AccountRepository,
  VerificationCodeRepository,
} from '../../../infrastructure/db/repositories';
import { UpdatePasswordDto } from '../../../infrastructure/http/dtos';
import { encodeValue } from '../../../domain/services';

@Injectable()
export class UpdatePasswordService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly veririficationCodeRepository: VerificationCodeRepository,
  ) {}

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[UpdatePasswordService] [updatePassword] - x-request-id: ${requestId}`,
      );

      const { password, forgotPasswordCode } = updatePasswordDto;

      // TODO get email from forgotPasswordCode once activate account endpoint is merged in QA with the required logic

      const email = 'ozounalocal37@yopmail.com';

      const hashPassword = await encodeValue(password);

      // TODO delete forgotPasswordCode used
    } catch (error) {
      this.logger.error(
        `[UpdatePasswordService] [updatePassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw error;
    }
  }
}
