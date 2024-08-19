import { ApiResponseOptions } from '@nestjs/swagger';
import { EventListDto, EventDto } from '../../../dtos';
import {
  BAD_REQUEST_ERROR_COMMON_PROPERTIES,
  FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
  INTERNAL_ERROR_COMMON_PROPERTIES,
  UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
} from './common-response-properties';

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
    description: 'Some inputs are missed or wrong',
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
  FORBIDDEN_ERROR: {
    description: 'Error for not have enough privileges',
    schema: {
      type: 'object',
      properties: {
        ...FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
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
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
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
        ...FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
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
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { example: PATHS.EVENTS },
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
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.EVENTS },
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
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.EVENTS },
      },
    },
  },
  FORBIDDEN_ERROR: {
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
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
        type: { type: 'string', example: PATHS.EVENTS },
      },
    },
  },
};
