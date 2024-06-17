import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
  ApiHeader,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LOGIN_HEADERS } from '../headers';
import { LOGIN_RESPONSES } from '../responses';

export function SwaggerAccountLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login an user' }),
    ApiHeader(LOGIN_HEADERS),
    ApiResponse(LOGIN_RESPONSES.OK),
    ApiBadRequestResponse(LOGIN_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(LOGIN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
  );
}
