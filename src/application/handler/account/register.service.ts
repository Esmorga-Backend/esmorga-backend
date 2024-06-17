import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AccountRegisterDto } from '../../../infrastructure/http/dtos';
import { GenerateTokenPair } from '../../../domain/services';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infrastructure/db/repositories';

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
    } catch (error) {
      throw error;
    }
  }
}
