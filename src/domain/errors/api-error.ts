import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(
    code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    title: string = 'internalServerError',
    detail: string = 'unexpected error',
    message: string = 'unexpected error',
  ) {
    super({ title, detail, message }, code);
  }
}
