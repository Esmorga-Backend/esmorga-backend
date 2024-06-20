import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
  ApiHeader,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { LOGIN_HEADERS, REGISTER_HEADER } from '../headers';
import { LOGIN_RESPONSES, REGISTER_RESPONSES } from '../responses';

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
