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

    const { title, detail, message } = exception.getResponse() as {
      title: string;
      detail: string;
      message: string;
    };

    const errorResponse = {
      title,
      status,
      type: request.url,
      detail,
      errors: [],
    };

    if (exception instanceof InternalServerErrorException) {
      return response.status(status).json({
        ...errorResponse,
        title: 'internalServerError',
        detail: 'unexpected error',
      });
    }

    if (exception instanceof BadRequestException) {
      if (message[0].includes('should not be empty'))
        return response.status(status).json({
          ...errorResponse,
          title: 'badRequestError',
          detail: 'some inputs are missing',
          errors: message,
        });

      return response.status(status).json({
        ...errorResponse,
        title: 'badRequestError',
        detail: message[0].split(' ')[0],
        errors: message,
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
