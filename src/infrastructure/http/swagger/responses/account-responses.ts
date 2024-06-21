import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions } from '@nestjs/swagger';
import { AccountLoggedDto, NewPairOfTokensDto } from '../../../dtos';

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
  LOGIN: '/v1/account/login',
  REFRESH_TOKEN: '/v1/account/refresh',
};

export const LOGIN_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'User has successfully logged in',
    type: AccountLoggedDto,
  },
  BAD_REQUEST_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'badRequestError',
        },
        status: { type: 'number', example: HttpStatus.BAD_REQUEST },
        type: { type: 'string', example: PATHS.LOGIN },
        detail: {
          type: 'string',
          example: 'some inputs are missing',
        },
        errors: {
          type: 'array',
          example: ['email should not be empty'],
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
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

export const REFRESH_TOKEN_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description:
      'A new pair of accesToken and refreshToken is succesfully provided',
    type: NewPairOfTokensDto,
  },
  BAD_REQUEST_ERROR: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Some inputs are missed or wrong',
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'badRequestError',
        },
        status: { type: 'number', example: HttpStatus.BAD_REQUEST },
        type: { type: 'string', example: PATHS.REFRESH_TOKEN },
        detail: {
          type: 'string',
          example: 'some inputs are missing',
        },
        errors: {
          type: 'array',
          example: ['refreshToken should not be empty'],
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
    status: HttpStatus.INTERNAL_SERVER_ERROR,
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
