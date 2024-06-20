import { ApiResponseOptions } from '@nestjs/swagger';
import { EventListDto } from '../../../dtos';

const BAD_REQUEST_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'badRequestError',
  },
  status: { type: 'number', example: 400 },
  type: { type: 'string', example: '' },
  detail: {
    type: 'string',
    example: 'some inputs are missing',
  },
};

const INTERNAL_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'internalServerError',
  },
  status: { type: 'number', example: 500 },
  type: { type: 'string', example: '' },
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
  POST_EVENT: '/v1/events',
};

export const CREATE_EVENT_RESPONSES: { [key: string]: ApiResponseOptions } = {
  CREATED: {
    description: 'Event successfully created',
    schema: {
      type: 'object',
      example: {},
    },
  },
  BAD_REQUEST_ERROR: {
    description: 'Error for missing inputs',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POST_EVENT },
        errors: {
          type: 'array',
          example: ['location.name should not be empty'],
        },
      },
    },
  },
  INTERNAL_ERROR: {
    description: 'Error not handled',
    schema: {
      type: 'object',
      properties: {
        ...INTERNAL_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POST_EVENT },
      },
    },
  },
};

export const GET_EVENTS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'List of avaliable events',
    type: EventListDto,
  },
  INTERNAL_ERROR: {
    description: 'Error not handled',
    schema: {
      type: 'object',
      properties: {
        ...INTERNAL_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.GET_EVENTS },
      },
    },
  },
};
