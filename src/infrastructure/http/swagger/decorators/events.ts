import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from '../../dtos';
import {
  CREATE_EVENT_HEADERS,
  GET_EVENTS_HEADERS,
  DELETE_EVENT_HEADERS,
  UPDATE_EVENT_HEADERS,
} from '../headers';
import {
  CREATE_EVENT_RESPONSES,
  GET_EVENTS_RESPONSES,
  UPDATE_EVENT_RESPONSES,
  DELETE_EVENT_RESPONSES,
} from '../responses/event-responses';

export function SwaggerCreateEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create an event.' }),
    ApiHeader(CREATE_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(CREATE_EVENT_HEADERS.CONTENT_TYPE),
    ApiBody({ type: CreateEventDto }),
    ApiCreatedResponse(CREATE_EVENT_RESPONSES.CREATED),
    ApiBadRequestResponse(CREATE_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiForbiddenResponse(CREATE_EVENT_RESPONSES.FORBIDDEN_ERROR),
    ApiInternalServerErrorResponse(CREATE_EVENT_RESPONSES.INTERNAL_ERROR),
    ApiUnauthorizedResponse(CREATE_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
  );
}

export function SwaggerGetEvents() {
  return applyDecorators(
    ApiOperation({ summary: 'Return a list of avaliable events.' }),
    ApiHeader(GET_EVENTS_HEADERS),
    ApiOkResponse(GET_EVENTS_RESPONSES.OK),
    ApiInternalServerErrorResponse(GET_EVENTS_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerUpdateEvent() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update an event.' }),
    ApiBody({ type: UpdateEventDto }),
    ApiHeader(UPDATE_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(UPDATE_EVENT_HEADERS.CONTENT_TYPE),
    ApiOkResponse(UPDATE_EVENT_RESPONSES.OK),
    ApiBadRequestResponse(UPDATE_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(UPDATE_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
    ApiForbiddenResponse(UPDATE_EVENT_RESPONSES.FORBIDDEN_ERROR),
    ApiInternalServerErrorResponse(UPDATE_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerDeleteEvents() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete event and the participant list related' }),
    ApiBearerAuth(),
    ApiHeader(DELETE_EVENT_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(DELETE_EVENT_HEADERS.CONTENT_TYPE),
    ApiNoContentResponse(DELETE_EVENT_RESPONSES.NO_CONTENT),
    ApiBadRequestResponse(DELETE_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(DELETE_EVENT_RESPONSES.UNAUTHORIZED_ERROR),
    ApiForbiddenResponse(DELETE_EVENT_RESPONSES.FORBIDDEN_ERROR),
    ApiInternalServerErrorResponse(DELETE_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}
