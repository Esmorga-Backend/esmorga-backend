import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { InvalidTokenApiError } from '../../../domain/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly logger: PinoLogger,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const { authorization, ['x-request-id']: requestId } = req.headers;

    this.logger.info(`[AuthGuard] - x-request-id:${requestId}`);

    try {
      const [type, token] = authorization.split(' ');
      if (!token || type !== 'Bearer') {
        throw new InvalidTokenApiError();
      }

      const jwtSecret = this.configService.get('JWT_SECRET');

      const { sessionId } = await this.jwtService.verifyAsync<{
        uuid: string;
        sessionId: string;
      }>(token, { secret: jwtSecret });

      if (!sessionId) throw new InvalidTokenApiError();

      req.headers['x-session-id'] = sessionId;
      res.set('x-session-id', sessionId);

      req.headers.authorization = token;
    } catch (error) {
      this.logger.error(
        `[AuthGuard] - x-request-id:${requestId}, error ${error}`,
      );

      throw new InvalidTokenApiError();
    }
    return true;
  }
}
