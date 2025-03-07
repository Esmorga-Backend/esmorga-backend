import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestId = createParamDecorator(
  (_, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest().headers['x-request-id'],
);
