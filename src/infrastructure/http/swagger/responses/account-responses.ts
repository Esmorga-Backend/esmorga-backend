import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import {
  AccountLoggedDto,
  NewPairOfTokensDto,
  EventListDto,
  EventListWithCreatorFlagDto,
  ProfileDto,
} from '../../../dtos';
import {
  BAD_REQUEST_ERROR_COMMON_PROPERTIES,
  FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
  INTERNAL_ERROR_COMMON_PROPERTIES,
  NOT_ACCEPTABLE_ERROR_COMMON_PROPERTIES,
  TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
  UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
  UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
} from './common-response-properties';

const PATHS = {
  ACTIVATE_ACCOUNT: '/v1/account/activate',
  CLOSE_CURRENT_SESSION: '/v1/account/session',
  DELETE_ACCOUNT: '/v1/account',
  FORGOT_PASSWORD: '/v1/account/password/forgot-init',
  GET_EVENTS_CREATED_BY_USER: '/v1/account/events/created',
  GET_PROFILE: '/v1/accout/profile',
  JOIN_EVENT: '/v1/account/events',
  LOGIN: '/v1/account/login',
  REGISTER: '/v1/account/register',
  REFRESH_TOKEN: '/v1/account/refresh',
  SEND_EMAIL_VERIFICATION: '/v1/account/email/verification',
  UPDATE_PASSWORD: '/v1/account/password',
  FORGOT_PASSWORD_UPDATE: '/v1/account/password/forgot-update',
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
  FORBIDDEN_ERROR: {
    description: 'User account is unverified',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'unverifiedUserError',
        },
        status: { type: 'number', example: HttpStatus.FORBIDDEN },
        type: { type: 'string', example: PATHS.LOGIN },
        detail: {
          type: 'string',
          example: 'user is unverified',
        },
        errors: {
          type: 'array',
          example: ['user is unverified'],
        },
      },
    },
  },
  BLOCKED_ACCOUNT_ERROR: {
    description: 'User account is blocked',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'blockedUserError',
        },
        status: { type: 'number', example: 423 },
        type: { type: 'string', example: PATHS.LOGIN },
        detail: {
          type: 'string',
          example: 'user is blocked',
        },
        errors: {
          type: 'array',
          example: ['user is blocked'],
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
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.LOGIN },
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
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.REGISTER },
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
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.REFRESH_TOKEN },
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
  UNPROCESSABLE_CONTENT_ERROR: {
    description: 'The event is full',
    schema: {
      type: 'object',
      properties: {
        ...UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
        detail: {
          type: 'string',
          example: 'maximum capacity reached',
        },
        errors: {
          type: 'array',
          example: ['event cannot accept more attendees'],
        },
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
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.JOIN_EVENT },
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

export const DELETE_ACCOUNT_RESPONSES: { [key: string]: ApiResponseOptions } = {
  NO_CONTENT: {
    description: 'User account has been deleted successfully',
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.DELETE_ACCOUNT },
        errors: {
          type: 'array',
          example: ['password should not be empty'],
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
        type: { type: 'string', example: PATHS.DELETE_ACCOUNT },
      },
    },
  },
  UNPROCCESABLE_CONTENT_ERROR: {
    description: 'Password is incorrect',
    schema: {
      type: 'object',
      properties: {
        ...UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.DELETE_ACCOUNT },
        detail: {
          type: 'string',
          example: 'invalid credentials',
        },
        errors: {
          type: 'array',
          example: ['password is invalid'],
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
        type: { type: 'string', example: PATHS.DELETE_ACCOUNT },
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
        type: { type: 'string', example: PATHS.DELETE_ACCOUNT },
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
  UNPROCESSABLE_CONTENT_ERROR: {
    description: 'The event is full',
    schema: {
      type: 'object',
      properties: {
        ...UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
        detail: {
          type: 'string',
          example: 'maximum capacity reached',
        },
        errors: {
          type: 'array',
          example: ['event cannot accept more attendees'],
        },
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
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
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

export const GET_MY_EVENTS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'List of available events user joined',
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
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
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

export const FORGOT_PASSWORD_RESPONSES: { [key: string]: ApiResponseOptions } =
  {
    NO_CONTENT: {
      description:
        'The email for forgotten password has been sent successfully',
    },
    BAD_REQUEST_ERROR: {
      status: HttpStatus.BAD_REQUEST,
      description: 'Some inputs are missed or wrong',
      schema: {
        type: 'object',
        properties: {
          ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
          type: { type: 'string', example: PATHS.FORGOT_PASSWORD },
          errors: {
            type: 'array',
            example: ['email should not be empty'],
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
          type: { type: 'string', example: PATHS.FORGOT_PASSWORD },
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
          type: { type: 'string', example: PATHS.FORGOT_PASSWORD },
        },
      },
    },
  };

export const SEND_EMAIL_VERIFICATION_RESPONSES: {
  [key: string]: ApiResponseOptions;
} = {
  NO_CONTENT: {
    description:
      'The email for verificate the account has been sent successfully',
  },
  BAD_REQUEST_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.SEND_EMAIL_VERIFICATION },
        errors: {
          type: 'array',
          example: ['email should not be empty'],
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
        type: { type: 'string', example: PATHS.SEND_EMAIL_VERIFICATION },
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
        type: { type: 'string', example: PATHS.SEND_EMAIL_VERIFICATION },
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
    TOO_MANY_REQUESTS_ERROR: {
      description: 'Too many requests, rate limit exceeded',
      schema: {
        type: 'object',
        properties: {
          ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
          type: { type: 'string', example: PATHS.ACTIVATE_ACCOUNT },
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

export const FORGOT_PASSWORD_UPDATE_RESPONSE: {
  [key: string]: ApiResponseOptions;
} = {
  NO_CONTENT: {
    description: 'ForgotPasswordCode used to update password',
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.FORGOT_PASSWORD_UPDATE },
        errors: {
          type: 'array',
          example: ['forgotPasswordCode should not be empty'],
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
        type: { type: 'string', example: PATHS.FORGOT_PASSWORD_UPDATE },
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
        type: { type: 'string', example: PATHS.FORGOT_PASSWORD_UPDATE },
      },
    },
  },
};

export const UPDATE_PASSWORD_RESPONSES: {
  [key: string]: ApiResponseOptions;
} = {
  OK: {
    description: 'User password succesfully updated',
    type: NewPairOfTokensDto,
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.UPDATE_PASSWORD },
        errors: {
          type: 'array',
          example: ['forgotPasswordCode should not be empty'],
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
        type: { type: 'string', example: PATHS.UPDATE_PASSWORD },
      },
    },
  },
  UNPROCESSABLE_CONTENT_ERROR: {
    description: 'Some inputs are invalid',
    schema: {
      type: 'object',
      properties: {
        ...UNPROCESSABLE_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.UPDATE_PASSWORD },
        detail: {
          type: 'string',
          example: 'invalid credentials',
        },
        errors: {
          type: 'array',
          example: ['unable to change password'],
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
        type: { type: 'string', example: PATHS.UPDATE_PASSWORD },
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
        type: { type: 'string', example: PATHS.UPDATE_PASSWORD },
      },
    },
  },
};

export const CLOSE_CURRENT_SESSION_RESPONSES: {
  [key: string]: ApiResponseOptions;
} = {
  NO_CONTENT: {
    description: 'The current session has been closed successfully',
  },
  BAD_REQUEST_ERROR: {
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        ...BAD_REQUEST_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.CLOSE_CURRENT_SESSION },
        detail: {
          type: 'string',
          example: 'Authorization',
        },
        errors: {
          type: 'array',
          example: ['Authorization should not be empty'],
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
        type: { type: 'string', example: PATHS.CLOSE_CURRENT_SESSION },
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
        type: { type: 'string', example: PATHS.CLOSE_CURRENT_SESSION },
      },
    },
  },
};

export const GET_EVENTS_CREATED_BY_USER_RESPONSES: {
  [key: string]: ApiResponseOptions;
} = {
  OK: {
    description: 'List of events created by the user',
    type: EventListWithCreatorFlagDto,
  },
  UNAUTHORIZED_ERROR: {
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.GET_EVENTS_CREATED_BY_USER },
      },
    },
  },
  FORBIDDEN_ERROR: {
    description: 'Error for not have enough privileges',
    schema: {
      type: 'object',
      properties: {
        ...FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
        type: { example: PATHS.GET_EVENTS_CREATED_BY_USER },
      },
    },
  },
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.GET_EVENTS_CREATED_BY_USER },
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
        type: { type: 'string', example: PATHS.GET_EVENTS_CREATED_BY_USER },
      },
    },
  },
};

export const GET_PROFILE_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'User profile',
    type: ProfileDto,
  },
  UNAUTHORIZED_ERROR: {
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.GET_PROFILE },
      },
    },
  },
  TOO_MANY_REQUESTS_ERROR: {
    description: 'Too many requests, rate limit exceeded',
    schema: {
      type: 'object',
      properties: {
        ...TOO_MANY_REQUESTS_ERROR_COMMON_PROPERTIES,
        type: { type: 'string', example: PATHS.GET_PROFILE },
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
        type: { type: 'string', example: PATHS.GET_PROFILE },
      },
    },
  },
};
