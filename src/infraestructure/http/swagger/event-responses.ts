import { HttpStatus } from '@nestjs/common';
import { ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { Event } from '../../../domain/entities';

const INTERNAL_ERROR_COMMON_PROPERTIES = {
  title: {
    type: 'string',
    example: 'InternalServerError',
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
  GET_EVENTS: '/v1/events',
};

export const GET_EVENTS_RESPONSES: { [key: string]: ApiResponseOptions } = {
  OK: {
    status: HttpStatus.OK,
    description: 'List of avaliable events',
    schema: {
      type: 'object',
      properties: {
        totalEvents: {
          type: 'number',
          example: 1,
        },
        events: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              eventId: { type: 'number', example: 1234 },
              eventName: { type: 'string', example: 'MobgenFest' },
              eventDate: { type: 'Date', example: '2024-03-08T10:05:30.915Z' },
              description: { type: 'string', example: 'Hello World' },
              eventType: { type: 'string', example: 'Party' },
              imageUrl: { type: 'string', example: 'Party' },
              location: {
                type: 'object',
                items: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number', example: 43.35525182148881 },
                    long: { type: 'number', example: -8.41937931298951 },
                    name: { type: 'string', example: 'A Coruña' },
                  },
                },
              },
              tags: { type: 'array', example: '["Meal", "Music"]' },
              createdAt: { type: 'date', example: '2024-03-08T10:05:30.915Z' },
              updatedAt: { type: 'date', example: '2024-03-08T10:05:30.915Z' },
            },
          },
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
        type: { type: 'string', example: PATHS.GET_EVENTS },
      },
    },
  },
};
