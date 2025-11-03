import { ApiResponseOptions } from '@nestjs/swagger';
import {
  BAD_REQUEST_ERROR_COMMON_PROPERTIES,
  FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
  INTERNAL_ERROR_COMMON_PROPERTIES,
  UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
} from './common-response-properties';
import { PollListDto } from '../../../dtos';

const PATHS = {
  POLLS: '/v1/polls',
};

export const CREATE_POLL_RESPONSES: { [key: string]: ApiResponseOptions } = {
  CREATED: {
    description: 'Poll successfully created',
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
        errors: {
          type: 'array',
          example: ['pollName should not be empty'],
        },
      },
    },
  },
  FORBIDDEN_ERROR: {
    description: 'Not enough privileges',
    schema: {
      type: 'object',
      properties: {
        ...FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
      },
    },
  },
  INTERNAL_ERROR: {
    description: 'Error not handled',
    schema: {
      type: 'object',
      properties: {
        ...INTERNAL_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
      },
    },
  },
  UNAUTHORIZED_ERROR: {
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
      },
    },
  },
};

export const GET_POLLS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'List of available polls',
    type: PollListDto,
  },
  INTERNAL_ERROR: {
    description: 'Error not handled',
    schema: {
      type: 'object',
      properties: {
        ...INTERNAL_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
      },
    },
  },
  UNAUTHORIZED_ERROR: {
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
      },
    },
  },
};
