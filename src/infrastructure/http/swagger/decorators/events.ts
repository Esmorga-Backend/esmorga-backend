import {
  ApiBadRequestResponse,
  ApiBody,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { CreateEventDto } from '../../dtos';
import { CREATE_EVENT_HEADERS, GET_EVENTS_HEADERS } from '../headers';
import {
  CREATE_EVENT_RESPONSES,
  GET_EVENTS_RESPONSES,
} from '../responses/event-responses';

export function SwaggerCreateEvent() {
  return applyDecorators(
    ApiOperation({ summary: 'Create an event.' }),
    ApiHeader(CREATE_EVENT_HEADERS),
    ApiBody({ type: CreateEventDto }),
    ApiResponse(CREATE_EVENT_RESPONSES.OK),
    ApiBadRequestResponse(CREATE_EVENT_RESPONSES.BAD_REQUEST_ERROR),
    ApiInternalServerErrorResponse(CREATE_EVENT_RESPONSES.INTERNAL_ERROR),
  );
}

export function SwaggerGetEvents() {
  return applyDecorators(
    ApiOperation({ summary: 'Return a list of avaliable events.' }),
    ApiHeader(GET_EVENTS_HEADERS),
    ApiResponse(GET_EVENTS_RESPONSES.OK),
    ApiInternalServerErrorResponse(GET_EVENTS_RESPONSES.INTERNAL_ERROR),
  );
}
