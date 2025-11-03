import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CREATE_POLL_HEADERS, GET_POLLS_HEADERS } from '../headers';
import { CREATE_POLL_RESPONSES, GET_POLLS_RESPONSES } from '../responses';

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

export function SwaggerGetPolls() {
  return applyDecorators(
    ApiOperation({
      summary: 'Return a list of available polls.',
    }),
    ApiBearerAuth(),
    ApiHeader(GET_POLLS_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(GET_POLLS_HEADERS.CONTENT_TYPE),
    ApiOkResponse(GET_POLLS_RESPONSES.OK),
    ApiUnauthorizedResponse(GET_POLLS_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(GET_POLLS_RESPONSES.INTERNAL_ERROR),
  );
}
