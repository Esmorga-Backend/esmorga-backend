import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { TokensRepository } from '../../../infrastructure/db/repositories';
import { RefreshTokenDto } from '../../../infrastructure/http/dtos';
import { NewRefreshTokenDto } from '../../../infrastructure/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { InvalidCredentialsApiError } from '../../../domain/errors';
import { GenerateTokenPair } from '../../../domain/services';

@Injectable()
export class RefreshTokenService {
  constructor(
    private configService: ConfigService,
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly tokensRepository: TokensRepository,
  ) {}

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<NewRefreshTokenDto> {
    try {
      const { refreshToken } = refreshTokenDto;

      const pairOfTokens =
        await this.tokensRepository.getPairOfTokensByRefreshToken(refreshToken);

      if (!pairOfTokens) throw new DataBaseUnathorizedError();

      const { uuid } = pairOfTokens;

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      await this.tokensRepository.removeTokensById(pairOfTokens.id);

      await this.tokensRepository.saveTokens(
        uuid,
        accessToken,
        newRefreshToken,
      );

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const newPairOfTokens: NewRefreshTokenDto = plainToClass(
        NewRefreshTokenDto,
        {
          accessToken,
          newRefreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

      return newPairOfTokens;
    } catch (error) {
      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidCredentialsApiError();

      throw error;
    }
  }
}
