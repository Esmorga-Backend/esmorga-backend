import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CREATE_POLL_HEADERS } from '../headers';
import { CREATE_POLL_RESPONSES } from '../responses';

export function SwaggerCreatePoll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a poll.',
    }),
    ApiBearerAuth(),
    ApiHeader(CREATE_POLL_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(CREATE_POLL_HEADERS.CONTENT_TYPE),
    ApiCreatedResponse(CREATE_POLL_RESPONSES.CREATED),
    ApiBadRequestResponse(CREATE_POLL_RESPONSES.BAD_REQUEST_ERROR),
    ApiForbiddenResponse(CREATE_POLL_RESPONSES.FORBIDDEN_ERROR),
    ApiUnauthorizedResponse(CREATE_POLL_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(CREATE_POLL_RESPONSES.INTERNAL_ERROR),
  );
}
