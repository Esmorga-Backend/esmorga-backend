import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateTokenPair {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Generate an accessToken and refreshToken using the uuid as payload.
   * @param uuid User id.
   * @returns New pair of tokens.
   */
  async generateTokens(uuid: string) {
    const accessToken = await this.jwtService.signAsync(
      { uuid },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: `${this.configService.get('ACCESS_TOKEN_TTL')}s`,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { uuid },
      {
        secret: this.configService.get('JWT_SECRET'),
      },
    );

    return { accessToken, refreshToken };
  }
}
