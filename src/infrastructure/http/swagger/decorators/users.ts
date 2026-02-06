import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { GET_USERS_HEADERS } from '../headers';
import { GET_USERS_RESPONSES } from '../responses';

export function SwaggerGetUsers() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get users with the pagination data sent in the request query.',
    }),
    ApiBearerAuth(),
    ApiHeader(GET_USERS_HEADERS.AUTHORIZATION_BEARER),
    ApiHeader(GET_USERS_HEADERS.CONTENT_TYPE),
    ApiOkResponse(GET_USERS_RESPONSES.OK),
    ApiBadRequestResponse(GET_USERS_RESPONSES.BAD_REQUEST_ERROR),
    ApiUnauthorizedResponse(GET_USERS_RESPONSES.UNAUTHORIZED_ERROR),
    ApiForbiddenResponse(GET_USERS_RESPONSES.FORBIDDEN_ERROR),
    ApiInternalServerErrorResponse(GET_USERS_RESPONSES.INTERNAL_ERROR),
  );
}
