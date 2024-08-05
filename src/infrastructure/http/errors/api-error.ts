import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiError extends HttpException {
  constructor(
    code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    title: string,
    detail: string,
    message: string,
  ) {
    super({ title, detail, message }, code);
  }
}
