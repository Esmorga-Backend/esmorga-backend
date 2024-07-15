import { ApiResponseOptions } from '@nestjs/swagger';
import { EventDto, EventListDto } from '../../../dtos';

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

const FORBIDDEN_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'unauthorizedRequestError',
  },
  status: { type: 'number', example: 403 },
  type: { type: 'string', example: '' },
  detail: {
    type: 'string',
    example: 'not authorized',
  },
  errors: {
    type: 'array',
    example: ['not enough privileges'],
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

const UNAUTHORIZED_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'unauthorizedRequestError',
  },
  status: { type: 'number', example: 401 },
  type: { type: 'string', example: '' },
  detail: {
    type: 'string',
    example: 'not authorized',
  },
  errors: {
    type: 'array',
    example: ['token invalid'],
  },
};

const PATHS = {
  EVENTS: '/v1/events',
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
        type: { example: PATHS.EVENTS },
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
        type: { example: PATHS.EVENTS },
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
        type: { example: PATHS.EVENTS },
      },
    },
  },
};

export const UPDATE_EVENT_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'Event successfully updated',
    type: EventDto,
  },
  BAD_REQUEST_ERROR: {
    description: 'Error for not existing event',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.EVENTS },
        detail: { example: 'eventId' },
        errors: { example: ['eventId invalid'] },
      },
    },
  },
  FORBIDDEN_ERROR: {
    description: 'Error for not have enough privileges',
    schema: {
      type: 'object',
      properties: {
        ...FORBIDDEN_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.EVENTS },
      },
    },
  },
  INTERNAL_ERROR: {
    description: 'Error not handled',
    schema: {
      type: 'object',
      properties: {
        ...INTERNAL_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.EVENTS },
      },
    },
  },
  UNAUTHORIZED_ERROR: {
    description: 'Error for invalid token',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.EVENTS },
      },
    },
  },
};
