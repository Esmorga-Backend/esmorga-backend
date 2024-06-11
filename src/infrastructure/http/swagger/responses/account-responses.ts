import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { AccountLoggedDTO } from '../../../dtos';

const INTERNAL_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'internalServerError',
  },
  status: { type: 'number', example: 500 },
  detail: {
    type: 'string',
    example: 'unexpected error',
  },
  errors: {
    type: 'array',
    example: [],
  },
};

const PATHS = {
  GET_EVENTS: '/v1/events',
};

export const LOGIN_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    status: HttpStatus.OK,
    description: 'User has successfully logged in',
    type: AccountLoggedDTO,
  },
  INTERNAL_ERROR: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error not handled',
    schema: {
      type: 'object',
      properties: {
        ...INTERNAL_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.GET_EVENTS },
      },
    },
  },
};
