import { ApiResponseOptions } from '@nestjs/swagger';
import {
  BAD_REQUEST_ERROR_COMMON_PROPERTIES,
  FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES,
  INTERNAL_ERROR_COMMON_PROPERTIES,
  UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES,
} from './common-response-properties';
import { UsersListPaginatedDto } from '../../../dtos';

export const GET_USERS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    description: 'User list retrieved successfully',
    type: UsersListPaginatedDto,
    schema: {
      example: {
        users: [
          {
            id: '64b0f37d9c8d4b3e8a123456',
            name: 'Alice',
            lastName: 'Cooper',
            email: 'alice.cooper@yopmail.com',
            role: 'USER',
          },
          {
            id: '64b0f37d9c8d4b3e8a654321',
            name: 'John',
            lastName: "O'Donnel-Vic",
            email: 'eventslogin01@yopmail.com',
            role: 'ADMIN',
          },
        ],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 45,
          totalPages: 5,
        },
      },
    },
  },
  BAD_REQUEST_ERROR: {
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: { ...BAD_REQUEST_ERROR_COMMON_PROPERTIES },
    },
  },
  UNAUTHORIZED_ERROR: {
    description: 'Unauthorized',
    schema: {
      type: 'object',
      properties: { ...UNAUTHORIZED_INVALID_TOKEN_COMMON_PROPERTIES },
    },
  },
  FORBIDDEN_ERROR: {
    description: 'Forbidden',
    schema: {
      type: 'object',
      properties: { ...FORBIDDEN_INVALID_ROLE_COMMON_PROPERTIES },
    },
  },
  INTERNAL_ERROR: {
    description: 'Internal Server Error',
    schema: {
      type: 'object',
      properties: { ...INTERNAL_ERROR_COMMON_PROPERTIES },
    },
  },
};
