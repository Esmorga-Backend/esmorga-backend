import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestId = createParamDecorator((data, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.headers['x-request-id'];
});
