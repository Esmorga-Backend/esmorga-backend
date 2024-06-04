import {
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (exception instanceof InternalServerErrorException) {
      return response.status(status).json({
        title: 'internalServerError',
        status,
        type: request.url,
        detail: 'unexpected error',
        errors: [],
      });
    }

    const { title, detail, message } = exception.getResponse() as {
      title: string;
      detail: string;
      message: string;
    };

    if (exception instanceof BadRequestException) {
      return response.status(status).json({
        title: 'badRequestError',
        status,
        type: request.url,
        detail: 'some inputs are invalid',
        errors: [message],
      });
    }

    return response.status(status).json({
      title,
      status,
      type: request.url,
      detail,
      errors: [message],
    });
  }
}
