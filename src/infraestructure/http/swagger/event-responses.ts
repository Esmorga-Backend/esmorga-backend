import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { Event } from '../../../domain/entities';

const INTERNAL_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'InternalServerError',
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

export const GET_EVENTS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    status: HttpStatus.OK,
    description: 'List of avaliable events',
    schema: {
      type: 'object',
      properties: {
        totalEvents: {
          type: 'number',
          example: 1,
        },
        events: {
          type: [Event],
          example: [Event],
        },
      },
    },
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
