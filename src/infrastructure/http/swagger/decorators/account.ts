import {
  ApiBadRequestResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotAcceptableResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  LOGIN_HEADERS,
  REGISTER_HEADER,
  REFRESH_TOKEN_HEADERS,
  JOIN_EVENT_HEADERS,
  DISJOIN_EVENT_HEADERS,
} from '../headers';
import {
  LOGIN_RESPONSES,
  REGISTER_RESPONSES,
  REFRESH_TOKEN_RESPONSES,
  JOIN_EVENT_RESPONSES,
  DISJOIN_EVENT_RESPONSES,
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

export function SwaggerJoinEvent() {
  return applyDecorators(
    ApiOperation({
      summary: 'Allow authenticated users to join as participants in an event',
    }),
    ApiBearerAuth(),
    ApiHeader(JOIN_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(JOIN_EVENT_HEADERS.CONTENT_TYPE),
    ApiNoContentResponse(JOIN_EVENT_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(JOIN_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(JOIN_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
    ApiNotAcceptableResponse(JOIN_EVENT_RESPONSES.NOT_ACCEPTABLE_ERROR),
    ApiInternalServerErrorResponse(JOIN_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerDisjoinEvent() {
  return applyDecorators(
    ApiOperation({
      summary:
        'Allow authenticated users to disjoin as participants from an event',
    }),
    ApiBearerAuth(),
    ApiHeader(DISJOIN_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(DISJOIN_EVENT_HEADERS.CONTENT_TYPE),
    ApiNoContentResponse(DISJOIN_EVENT_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(DISJOIN_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(DISJOIN_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
    ApiNotAcceptableResponse(DISJOIN_EVENT_RESPONSES.NOT_ACCEPTABLE_ERROR),
    ApiInternalServerErrorResponse(DISJOIN_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}
