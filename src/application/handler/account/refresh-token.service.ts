import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { SessionRepository } from '../../../infrastructure/db/repositories';
import { RefreshTokenDto } from '../../../infrastructure/http/dtos';
import { NewPairOfTokensDto } from '../../../infrastructure/dtos';
import { DataBaseUnauthorizedError } from '../../../infrastructure/db/errors';
import { InvalidCredentialsRefreshApiError } from '../../../domain/errors';
import { SessionGenerator } from '../../../domain/services';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly logger: PinoLogger,
    private configService: ConfigService,
    private jwtService: JwtService,
    private readonly sessionGenerator: SessionGenerator,
    private readonly sessionRepository: SessionRepository,
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

      const { sessionId, id: refreshTokenId } =
        await this.jwtService.verifyAsync<{
          uuid: string;
          sessionId: string;
          id: string;
        }>(refreshToken, { secret: jwtSecret });

      const session = await this.sessionRepository.getBySessionId(
        sessionId,
        requestId,
      );

      this.logger.info(
        `[RegisterService] [refreshToken] - x-request-id:${requestId}, refreshToken ${refreshToken}`,
      );
      if (!session?.uuid) throw new InvalidCredentialsRefreshApiError();
      if (session.refreshTokenId && session.refreshTokenId !== refreshTokenId)
        throw new InvalidCredentialsRefreshApiError();

      const {
        accessToken,
        refreshToken: newRefreshToken,
        refreshTokenId: newRefreshTokenId,
      } = await this.sessionGenerator.generateTokens(session.uuid, sessionId);

      await this.sessionRepository.updateRefreshTokenId(
        sessionId,
        newRefreshTokenId,
        requestId,
      );

      const ttl = this.configService.get('ACCESS_TOKEN_TTL');

      const newPairOfTokens = plainToInstance(
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
        error instanceof DataBaseUnauthorizedError ||
        error instanceof JsonWebTokenError
      )
        throw new InvalidCredentialsRefreshApiError();

      throw error;
    }
  }
}
