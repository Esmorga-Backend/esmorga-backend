import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import {
  AccountRepository,
  TokensRepository,
} from '../../../infraestructure/db/repositories';
import { AccountLoginDTO, UserProfileDTO } from '../../../infraestructure/dtos';
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
  ) {}

  async login(accountLoginDTO: AccountLoginDTO) {
    try {
      const { email, password } = accountLoginDTO;

      const user = await this.accountRepository.getUserByEmail(email);

      validateLoginCredentials(user, password);

      const adaptedUserProfile = plainToClass(UserProfileDTO, user, {
        excludeExtraneousValues: true,
      });

      const { uuid } = adaptedUserProfile;

      const { accessToken, refreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      await this.tokensRepository.saveTokens(uuid, accessToken, refreshToken);
      return adaptedUserProfile;
    } catch (error) {
      throw error;
    }
  }
}
