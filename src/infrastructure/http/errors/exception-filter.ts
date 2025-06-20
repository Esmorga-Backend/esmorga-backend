import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
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

    // unexpected error scenario
    if (exception instanceof InternalServerErrorException) {
      return response.status(status).json({
        ...errorResponse,
        title: 'internalServerError',
        detail: 'unexpected error',
      });
    }

    // DTO scenario
    if (exception instanceof BadRequestException) {
      const firstErrorMessage = message[0];

      if (firstErrorMessage.includes('should not be empty'))
        return response.status(status).json({
          ...errorResponse,
          title: 'badRequestError',
          detail: 'some inputs are missing',
          errors: [firstErrorMessage],
        });

      return response.status(status).json({
        ...errorResponse,
        title: 'badRequestError',
        detail: firstErrorMessage.split(' ')[0],
        errors: [firstErrorMessage],
      });
    }

    // IP rate limit reached scenario
    if (exception instanceof ThrottlerException) {
      return response.status(status).json({
        ...errorResponse,
        title: 'tooManyRequestsError',
        detail: 'request limit achieved',
        errors: ['IP temporarily blocked'],
      });
    }

    // default scenario
    return response.status(status).json({
      title,
      status,
      type: request.url,
      detail,
      errors: [message],
    });
  }
}
