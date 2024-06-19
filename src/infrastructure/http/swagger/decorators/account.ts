import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LOGIN_HEADERS, REFRESH_TOKEN_HEADERS } from '../headers';
import { LOGIN_RESPONSES, REFRESH_TOKEN_RESPONSES } from '../responses';

export function SwaggerAccountLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login an user.' }),
    ApiHeader(LOGIN_HEADERS),
    ApiResponse(LOGIN_RESPONSES.OK),
    ApiBadRequestResponse(LOGIN_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(LOGIN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerRefreshToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh token.' }),
    ApiHeader(REFRESH_TOKEN_HEADERS),
    ApiResponse(REFRESH_TOKEN_RESPONSES.OK),
    ApiBadRequestResponse(REFRESH_TOKEN_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(REFRESH_TOKEN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(REFRESH_TOKEN_RESPONSES.INTERNAL_ERROR),
  );
}
