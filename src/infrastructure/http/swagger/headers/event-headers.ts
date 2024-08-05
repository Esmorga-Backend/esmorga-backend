import { ACCESS_TOKEN, CONTENT_TYPE } from './common';

export const GET_EVENTS_HEADERS = {
  ...CONTENT_TYPE,
};

export const CREATE_EVENT_HEADERS = {
  ...CONTENT_TYPE,
};

export const UPDATE_EVENT_HEADERS = { CONTENT_TYPE, ACCESS_TOKEN };
