import { ApiResponseOptions } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
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
  DELETE_EVENT: '/v1/events',
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

export const DELETE_EVENT_RESPONSES: { [key: string]: ApiResponseOptions } = {
  NO_CONTENT: {
    description: 'Event data has been succesfully delete',
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'badRequestError',
        },
        status: { type: 'number', example: HttpStatus.BAD_REQUEST },
        type: { type: 'string', example: PATHS.DELETE_EVENT },
        detail: {
          type: 'string',
          example: 'some inputs are missing',
        },
        errors: {
          type: 'array',
          example: ['eventId should not be empty'],
        },
      },
    },
  },
  UNAUTHORIZED_ERROR: {
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'unauthorizedRequestError',
        },
        status: { type: 'number', example: HttpStatus.UNAUTHORIZED },
        type: { type: 'string', example: PATHS.DELETE_EVENT },
        detail: {
          type: 'string',
          example: 'not authorized',
        },
        errors: {
          type: 'array',
          example: ['token invalid'],
        },
      },
    },
  },
  FORBIDDEN_ERROR: {
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'unauthorizedRequestError',
        },
        status: { type: 'number', example: HttpStatus.FORBIDDEN },
        type: { type: 'string', example: PATHS.DELETE_EVENT },
        detail: {
          type: 'string',
          example: 'not authorized',
        },
        errors: {
          type: 'array',
          example: ['not enough privileges'],
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
        type: { type: 'string', example: PATHS.DELETE_EVENT },
      },
    },
  },
};
