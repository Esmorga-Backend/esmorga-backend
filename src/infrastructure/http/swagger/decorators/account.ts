import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  LOGIN_HEADERS,
  REGISTER_HEADER,
  REFRESH_TOKEN_HEADERS,
} from '../headers';
import {
  LOGIN_RESPONSES,
  REGISTER_RESPONSES,
  REFRESH_TOKEN_RESPONSES,
} from '../responses';

export function SwaggerAccountLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'Login an user.' }),
    ApiHeader(LOGIN_HEADERS),
    ApiOkResponse(LOGIN_RESPONSES.OK),
    ApiBadRequestResponse(LOGIN_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(LOGIN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerAccountRegister() {
  return applyDecorators(
    ApiOperation({ summary: 'Register a new user' }),
    ApiHeader(REGISTER_HEADER),
    ApiCreatedResponse(REGISTER_RESPONSES.CREATED),
    ApiBadRequestResponse(REGISTER_RESPONSES.BAD_REQUEST_ERROR),
    ApiConflictResponse(REGISTER_RESPONSES.CONFLICT_ERROR),
    ApiInternalServerErrorResponse(LOGIN_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerRefreshToken() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh token.' }),
    ApiHeader(REFRESH_TOKEN_HEADERS),
    ApiOkResponse(REFRESH_TOKEN_RESPONSES.OK),
    ApiBadRequestResponse(REFRESH_TOKEN_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(REFRESH_TOKEN_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(REFRESH_TOKEN_RESPONSES.INTERNAL_ERROR),
  );
}
