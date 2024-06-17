import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import { GenerateTokenPair } from '../../../domain/services';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';
import { DataBaseConflictError } from '../../../infrastructure/db/errors';
import { EmailConflictApiError } from '../../../domain/errors';

@Injectable()
export class RegisterService {
  constructor(
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private configService: ConfigService,
  ) {}

  async register(accountRegisterDto: AccountRegisterDto) {
    try {
      await this.accountRepository.saveUser(accountRegisterDto);

      const { userProfile } = await this.accountRepository.getUserByEmail(
        accountRegisterDto.email,
      );

      return userProfile;
    } catch (error) {
      if (error instanceof DataBaseConflictError)
        throw new EmailConflictApiError();

      throw error;
    }
  }
}
