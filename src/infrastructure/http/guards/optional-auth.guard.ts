import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { AuthGuard } from './auth.guard';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly logger: PinoLogger,
    private readonly authGuard: AuthGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { authorization, ['x-request-id']: requestId } = req.headers;

    this.logger.info(`[OptionalAuthGuard] - x-request-id:${requestId}`);

    if (!authorization) {
      this.logger.info(
        `[OptionalAuthGuard] - x-request-id:${requestId} - No authorization header, skipping auth`,
      );
      return true;
    }

    return this.authGuard.canActivate(context);
  }
}
