import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infraestructure/db/repositories';
import {
  AccountLoginDTO,
  AccountLoggedDTO,
} from '../../../infraestructure/dtos';
import {
  validateLoginCredentials,
  GenerateTokenPair,
} from '../../../domain/services';

@Injectable()
export class LoginService {
  constructor(
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: TokensRepository,
    private configService: ConfigService,
  ) {}

  async login(accountLoginDTO: AccountLoginDTO) {
    try {
      const { email, password } = accountLoginDTO;

      const { userProfile, password: userDbPassword } =
        await this.accountRepository.getUserByEmail(email);

      validateLoginCredentials(userDbPassword, password);

      const { uuid } = userProfile;

      const { accessToken, refreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      await this.tokensRepository.saveTokens(uuid, accessToken, refreshToken);

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const accountLoggedDTO = plainToClass(
        AccountLoggedDTO,
        {
          profile: userProfile,
          accessToken,
          refreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

      return accountLoggedDTO;
    } catch (error) {
      throw error;
    }
  }
}
