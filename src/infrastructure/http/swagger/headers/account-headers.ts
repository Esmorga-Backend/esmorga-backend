import { CONTENT_TYPE, AUTHORIZATION_BEARER } from './common';

export const LOGIN_HEADERS = {
  ...CONTENT_TYPE,
};

export const REGISTER_HEADER = {
  ...CONTENT_TYPE,
};

export const REFRESH_TOKEN_HEADERS = {
  ...CONTENT_TYPE,
};

export const JOIN_EVENT_HEADERS = {
  CONTENT_TYPE,
  AUTHORIZATION_BEARER,
};
