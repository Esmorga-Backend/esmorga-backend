import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateTokenPair {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateTokens(uuid: string) {
    const accessToken = await this.jwtService.signAsync(
      { uuid },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '3300s',
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
