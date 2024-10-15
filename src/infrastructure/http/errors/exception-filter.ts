import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter<HttpException> {
  override catch(exception: HttpException, host: ArgumentsHost) {
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

    // IP rate limit reached scenario
    if (exception instanceof ThrottlerException) {
      return response.status(status).json({
        ...errorResponse,
        title: 'tooManyRequestError',
        detail: 'request limit achieved',
        errors: ['IP temporarily blocked'],
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
