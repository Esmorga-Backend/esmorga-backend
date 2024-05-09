import { Catch, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const { title, detail, message } = exception.getResponse() as {
      title: string;
      detail: string;
      message: string;
    };

    response.status(status).json({
      title,
      status,
      type: request.url,
      detail,
      errors: [message],
    });
  }
}
