import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SessionId = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().headers['x-session-id'],
);
