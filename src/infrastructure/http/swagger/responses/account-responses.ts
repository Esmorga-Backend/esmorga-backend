import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import {
  AccountLoggedDto,
  NewPairOfTokensDto,
  EventListDto,
} from '../../../dtos';
import {
  BAD_REQUEST_ERROR_COMMON_PROPERTIES,
  UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
  INTERNAL_ERROR_COMMON_PROPERTIES,
  NOT_ACCEPTABLE_ERROR_COMMON_PROPERTIES,
} from './common-response-properties';

const PATHS = {
  LOGIN: '/v1/account/login',
  REGISTER: '/v1/account/register',
  REFRESH_TOKEN: '/v1/account/refresh',
  JOIN_EVENT: '/v1/account/events',
  ACTIVATE_ACCOUNT: '/v1/account/activate',
};

export const LOGIN_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'User has successfully logged in',
    type: AccountLoggedDto,
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.LOGIN },
        errors: {
          type: 'array',
          example: ['email should not be empty'],
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
        type: { type: 'string', example: PATHS.LOGIN },
        detail: {
          type: 'string',
          example: 'inputs are invalid',
        },
        errors: {
          type: 'array',
          example: ['email password combination is not correct'],
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
        type: { type: 'string', example: PATHS.LOGIN },
      },
    },
  },
};

export const REGISTER_RESPONSES: { [key: string]: ApiResponseOptions } = {
  CREATED: {
    description:
      'User has successfully created and verification email has been sent',
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
        type: { type: 'string', example: PATHS.REGISTER },
        errors: {
          type: 'array',
          example: ['email should not be empty'],
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
        type: { type: 'string', example: PATHS.REGISTER },
      },
    },
  },
};

export const REFRESH_TOKEN_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description:
      'A new pair of accesToken and refreshToken is succesfully provided',
    type: NewPairOfTokensDto,
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.REFRESH_TOKEN },
        errors: {
          type: 'array',
          example: ['refreshToken should not be empty'],
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
        type: { type: 'string', example: PATHS.REFRESH_TOKEN },
        detail: {
          type: 'string',
          example: 'unauthorized',
        },
        errors: {
          type: 'array',
          example: ['unauthorized'],
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
        type: { type: 'string', example: PATHS.REFRESH_TOKEN },
      },
    },
  },
};

export const JOIN_EVENT_RESPONSES: { [key: string]: ApiResponseOptions } = {
  NO_CONTENT: {
    description: 'User has successfully joined in the event',
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
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
        type: { type: 'string', example: PATHS.JOIN_EVENT },
      },
    },
  },
  NOT_ACCEPTABLE_ERROR: {
    description: 'Can not join celebrated events',
    schema: {
      type: 'object',
      properties: {
        ...NOT_ACCEPTABLE_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
        errors: {
          type: 'array',
          example: ['cannot join past events'],
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
        type: { type: 'string', example: PATHS.JOIN_EVENT },
      },
    },
  },
};

export const DISJOIN_EVENT_RESPONSES: { [key: string]: ApiResponseOptions } = {
  NO_CONTENT: {
    description: 'User has successfully joined in the event',
  },
  BAD_REQUEST_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
        errors: {
          type: 'array',
          example: ['eventId should not be empty'],
        },
      },
    },
  },
  UNAUTHORIZED_ERROR: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
      },
    },
  },
  NOT_ACCEPTABLE_ERROR: {
    description: 'Can not disjoin celebrated events',
    schema: {
      type: 'object',
      properties: {
        ...NOT_ACCEPTABLE_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
        errors: {
          type: 'array',
          example: ['cannot disjoin past events'],
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
        type: { type: 'string', example: PATHS.JOIN_EVENT },
      },
    },
  },
};

export const GET_MY_EVENTS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'List of avaliable events user joined',
    type: EventListDto,
  },
  UNAUTHORIZED_ERROR: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
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
        type: { type: 'string', example: PATHS.JOIN_EVENT },
      },
    },
  },
};

export const ACTIVATE_ACCOUNT_RESPONSES: { [key: string]: ApiResponseOptions } =
  {
    OK: {
      description: 'User status succesfully updated to ACTIVE',
      type: AccountLoggedDto,
    },
    BAD_REQUEST_ERROR: {
      description: 'Some inputs are missed or wrong',
      schema: {
        type: 'object',
        properties: {
          ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
          type: { type: 'string', example: PATHS.ACTIVATE_ACCOUNT },
          errors: {
            type: 'array',
            example: ['verificationCode should not be empty'],
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
          type: { type: 'string', example: PATHS.ACTIVATE_ACCOUNT },
        },
      },
    },
  };
