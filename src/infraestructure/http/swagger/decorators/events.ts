import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
  ApiHeader,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { GET_EVENTS_HEADERS } from '../headers';
import { GET_EVENTS_RESPONSES } from '../responses/event-responses';

export function SwaggerGetEvents() {
  return applyDecorators(
    ApiOperation({ summary: 'Return a list of avaliable events' }),
    ApiHeader(GET_EVENTS_HEADERS),
    ApiResponse(GET_EVENTS_RESPONSES.OK),
    ApiInternalServerErrorResponse(GET_EVENTS_RESPONSES.INTERNAL_ERROR),
  );
}
