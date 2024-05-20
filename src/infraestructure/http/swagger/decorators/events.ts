import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { GET_EVENTS_RESPONSES } from '../responses/event-responses';

export function SwaggerGetEvents() {
  return applyDecorators(
    ApiOperation({ summary: 'Return a list of avaliable events' }),
    ApiResponse(GET_EVENTS_RESPONSES.OK),
    ApiInternalServerErrorResponse(GET_EVENTS_RESPONSES.INTERNAL_ERROR),
  );
}
