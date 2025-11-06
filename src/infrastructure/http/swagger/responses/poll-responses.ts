import { ApiResponseOptions } from '@nestjs/swagger';
import {
  BAD_REQUEST_ERROR_COMMON_PROPERTIES,
  CONFLICT_ERROR_COMMON_PROPERTIES,
  FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
  INTERNAL_ERROR_COMMON_PROPERTIES,
  NOT_FOUND_ERROR_COMMON_PROPERTIES,
  UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
  UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
  TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
} from './common-response-properties';
import { PollDto, PollListDto } from '../../../dtos';

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

export const VOTE_POLL_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'Poll successfully voted',
    type: PollDto,
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
          example: ['selectedOptions should not be empty'],
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
        type: { example: PATHS.POLLS },
      },
    },
  },
  NOT_FOUND_ERROR: {
    description: 'PollId not found',
    schema: {
      type: 'object',
      properties: {
        ...NOT_FOUND_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
        errors: {
          type: 'array',
          example: ['pollId not found'],
        },
      },
    },
  },
  CONFLICT_ERROR: {
    description: 'Can not vote on past polls',
    schema: {
      type: 'object',
      properties: {
        ...CONFLICT_ERROR_COMMON_PROPERTIES,
        type: { example: PATHS.POLLS },
        errors: {
          type: 'array',
          example: ['poll voting deadline passed'],
        },
      },
    },
  },
  UNPROCESSABLE_CONTENT_ERROR: {
    description: 'Too many options selected',
    schema: {
      type: 'object',
      properties: {
        ...UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.POLLS },
        detail: {
          type: 'string',
          example: 'multiple selection is not allowed',
        },
        errors: {
          type: 'array',
          example: ['too many options provided'],
        },
      },
    },
  },
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.POLLS },
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
};
