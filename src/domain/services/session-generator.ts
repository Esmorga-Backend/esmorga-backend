import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class SessionGenerator {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate an accessToken and refreshToken using the uuid as payload.
   * @param uuid User id.
   * @returns New pair of tokens.
   */
  async generateSession(uuid: string) {
    const sessionId = randomUUID();
    const { accessToken, refreshToken, refreshTokenId } =
      await this.generateTokens(uuid, sessionId);

    return { accessToken, refreshToken, sessionId, refreshTokenId };
  }

  /**
   * Generate an accessToken and refreshToken using the uuid as payload.
   * @param uuid User id.
   * @returns New pair of tokens.
   */
  async generateTokens(uuid: string, sessionId: string) {
    const refreshTokenId = randomUUID();
    const accessToken = await this.jwtService.signAsync(
      { uuid, sessionId },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: `${this.configService.get('ACCESS_TOKEN_TTL')}s`,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { uuid, sessionId, id: refreshTokenId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );

    return { accessToken, refreshToken, sessionId, refreshTokenId };
  }
}
