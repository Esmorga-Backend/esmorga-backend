import { plainToInstance } from 'class-transformer';
import {
  FUTURE_EVENT_MOCK_DB_ID,
  EVENT_CORE_FIELDS_MOCK_DB_ID,
  OLD_EVENT_MOCK_DB_ID,
} from './common';
import { EventDto } from '../../../src/infrastructure/dtos';

const currentDate: Date = new Date();

const futureDate: Date = new Date();
futureDate.setFullYear(new Date().getFullYear() + 1);

const oldDate: Date = new Date();
oldDate.setFullYear(new Date().getFullYear() - 1);

export const UPDATED_EVENT_MOCK_DB = {
  _id: '6656e23640e1fdb4ceb23cc9',
  eventName: 'MobgenFest',
  eventDate: futureDate,
  description: 'Hello World',
  eventType: 'Party',
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'A Coruña',
  },
  tags: ['Meal', 'Music'],
  createdAt: currentDate,
  updatedAt: currentDate,
  updatedBy: '665f019c17331ebee550b2f5',
};

export const UPDATED_EVENT_MOCK_DTO = plainToInstance(
  EventDto,
  UPDATED_EVENT_MOCK_DB,
);

export const FUTURE_EVENT_MOCK_DB = {
  _id: FUTURE_EVENT_MOCK_DB_ID,
  eventName: 'MobgenFest',
  eventDate: futureDate,
  description: 'Hello World',
  eventType: 'Party',
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'A Coruña',
  },
  tags: ['Meal', 'Music'],
  createdAt: currentDate,
  updatedAt: currentDate,
};

export const FUTURE_EVENT_MOCK_DTO = plainToInstance(
  EventDto,
  FUTURE_EVENT_MOCK_DB,
);

// Event with only mandatory fields
export const EVENT_CORE_FIELDS_MOCK_DB = {
  _id: EVENT_CORE_FIELDS_MOCK_DB_ID,
  eventName: 'MobgenFest',
  eventDate: futureDate,
  description: 'Hello World',
  eventType: 'Party',
  location: {
    name: 'A Coruña',
  },
  createdBy: 'esmorga.test.03@yopmail.com',
  createdAt: currentDate,
  updatedAt: currentDate,
};

export const EVENT_CORE_FIELDS_MOCK_DTO = plainToInstance(
  EventDto,
  EVENT_CORE_FIELDS_MOCK_DB,
);

// Event celebrated
export const OLD_EVENT_MOCK_DB = {
  _id: OLD_EVENT_MOCK_DB_ID,
  eventName: 'Paintball',
  eventDate: oldDate,
  description: 'Hello World',
  eventType: 'Sport',
  imageUrl: 'img.url',
  location: {
    lat: 43.35525182148881,
    long: -8.41937931298951,
    name: 'Vigo',
  },
  tags: ['Shoots', 'Sports'],
  createdAt: currentDate,
  updatedAt: currentDate,
};

export const OLD_EVENT_MOCK_DTO = plainToInstance(EventDto, OLD_EVENT_MOCK_DB);
