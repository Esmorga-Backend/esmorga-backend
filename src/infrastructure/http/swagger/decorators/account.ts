import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
  ApiHeader,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LOGIN_HEADERS } from '../headers';
import { LOGIN_RESPONSES } from '../responses';

export function SwaggerAccountLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login an user' }),
    ApiHeader(LOGIN_HEADERS),
    ApiResponse(LOGIN_RESPONSES.OK),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
  );
}
