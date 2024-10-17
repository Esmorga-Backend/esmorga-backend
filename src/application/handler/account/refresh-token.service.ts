import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { TokensRepository } from '../../../infrastructure/db/repositories';
import { RefreshTokenDto } from '../../../infrastructure/http/dtos';
import { NewPairOfTokensDto } from '../../../infrastructure/dtos';
import { DataBaseUnathorizedError } from '../../../infrastructure/db/errors';
import { InvalidCredentialsRefreshApiError } from '../../../domain/errors';
import { SessionGenerator } from '../../../domain/services';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly sessionGenerator: SessionGenerator,
    private readonly tokensRepository: TokensRepository,
  ) {}

  /**
   * Consume the refreshToken provided to generate a new pair.
   *
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

      const jwtSecret = this.configService.get('JWT_REFRESH_SECRET');

      const { sessionId } = await this.jwtService.verifyAsync<{
        uuid: string;
        sessionId: string;
      }>(refreshToken, { secret: jwtSecret });

      let uuid: string, id: string;

      // accept refreshToken without sessionId
      if (!sessionId) {
        const pairOfTokens =
          await this.tokensRepository.getPairOfTokensByRefreshToken(
            refreshToken,
            requestId,
          );

        id = pairOfTokens.id;
        uuid = pairOfTokens.uuid;
      } else {
        const pairOfTokens = await this.tokensRepository.getBySessionId(
          sessionId,
          requestId,
        );

        id = pairOfTokens.id;
        uuid = pairOfTokens.uuid;
      }

      this.logger.info(
        `[RegisterService] [refreshToken] - x-request-id:${requestId}, refreshToken ${refreshToken}`,
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
        sessionId: newSessionId,
      } = await this.sessionGenerator.generateSession(uuid);

      await this.tokensRepository.saveSession(uuid, newSessionId, requestId);

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

      if (
        error instanceof DataBaseUnathorizedError ||
        error instanceof JsonWebTokenError
      )
        throw new InvalidCredentialsRefreshApiError();

      throw error;
    }
  }
}
