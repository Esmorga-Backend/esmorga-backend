import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { TokensRepository } from '../../../infrastructure/db/repositories';
import { RefreshTokenDto } from '../../../infrastructure/http/dtos';
import { NewPairOfTokensDto } from '../../../infrastructure/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { InvalidCredentialsRefreshApiError } from '../../../domain/errors';
import { GenerateTokenPair } from '../../../domain/services';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
    private readonly generateTokenPair: GenerateTokenPair,
    private readonly tokensRepository: TokensRepository,
  ) {}

  /**
   * Consume the refreshToken provided to generate a new pair.
   * @param refreshTokenDto - DTO contain the refresh token.
   * @param requestId - Request identifier.
   * @returns NewPairOfTokensDto - New pair of tokens.
   * @throws InvalidCredentialsRefreshApiError - If the refresh token is invalid or unauthorized.
   */
  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
    requestId?: string,
  ): Promise<NewPairOfTokensDto> {
    try {
      const { refreshToken } = refreshTokenDto;

      this.logger.info(
        `[RegisterService] [refreshToken] - x-request-id:${requestId}, refreshToken ${refreshToken}`,
      );

      const pairOfTokens =
        await this.tokensRepository.getPairOfTokensByRefreshToken(
          refreshToken,
          requestId,
        );

      const { id, uuid } = pairOfTokens;

      const { accessToken, refreshToken: newRefreshToken } =
        await this.generateTokenPair.generateTokens(uuid);

      await this.tokensRepository.saveTokens(
        uuid,
        accessToken,
        newRefreshToken,
        requestId,
      );

      await this.tokensRepository.removeTokensById(id, requestId);

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const newPairOfTokens = plainToClass(
        NewPairOfTokensDto,
        {
          accessToken,
          refreshToken: newRefreshToken,
          ttl,
        },
        { excludeExtraneousValues: true },
      );

      return newPairOfTokens;
    } catch (error) {
      this.logger.error(
        `[RegisterService] [refreshToken] - x-request-id:${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnathorizedError)
        throw new InvalidCredentialsRefreshApiError();

      throw error;
    }
  }
}
