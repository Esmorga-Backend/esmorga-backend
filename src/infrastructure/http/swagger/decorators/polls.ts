import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
  CREATE_POLL_HEADERS,
  GET_POLLS_HEADERS,
  VOTE_POLL_HEADERS,
} from '../headers';
import {
  CREATE_POLL_RESPONSES,
  GET_POLLS_RESPONSES,
  VOTE_POLL_RESPONSES,
} from '../responses';
import { VOTE_POLL_PARAM } from '../params';

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
    ApiHeader(GET_POLLS_HEADERS.AUTHORIZATION_BEARER_OPTIONAL),
    ApiHeader(GET_POLLS_HEADERS.CONTENT_TYPE),
    ApiOkResponse(GET_POLLS_RESPONSES.OK),
    ApiUnauthorizedResponse(GET_POLLS_RESPONSES.UNAUTHORIZED_ERROR),
    ApiInternalServerErrorResponse(GET_POLLS_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerVotePoll() {
  return applyDecorators(
    ApiOperation({
      summary: 'Vote on a poll.',
    }),
    ApiBearerAuth(),
    ApiHeader(VOTE_POLL_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(VOTE_POLL_HEADERS.CONTENT_TYPE),
    ApiParam(VOTE_POLL_PARAM),
    ApiOkResponse(VOTE_POLL_RESPONSES.OK),
    ApiBadRequestResponse(VOTE_POLL_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(VOTE_POLL_RESPONSES.UNAUTHORIZED_ERROR),
    ApiNotFoundResponse(VOTE_POLL_RESPONSES.NOT_FOUND_ERROR),
    ApiConflictResponse(VOTE_POLL_RESPONSES.CONFLICT_ERROR),
    ApiUnprocessableEntityResponse(
      VOTE_POLL_RESPONSES.UNPROCESSABLE_CONTENT_ERROR,
    ),
    ApiTooManyRequestsResponse(VOTE_POLL_RESPONSES.TOO_MANY_REQUESTS_ERROR),
    ApiInternalServerErrorResponse(VOTE_POLL_RESPONSES.INTERNAL_ERROR),
  );
}
