import { HttpStatus } from '@nestjs/common';

export const BAD_REQUEST_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'badRequestError',
  },
  status: { type: 'number', example: HttpStatus.BAD_REQUEST },
  type: { type: 'string', example: '' },
  detail: {
    type: 'string',
    example: 'some inputs are missing',
  },
};

export const UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'unauthorizedRequestError',
  },
  status: { type: 'number', example: HttpStatus.UNAUTHORIZED },
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

export const INTERNAL_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'internalServerError',
  },
  status: { type: 'number', example: HttpStatus.INTERNAL_SERVER_ERROR },
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
