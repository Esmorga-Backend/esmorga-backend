import { ACCESS_TOKEN, CONTENT_TYPE } from './common';

export const GET_EVENTS_HEADERS = {
  ...CONTENT_TYPE,
};

export const CREATE_EVENT_HEADERS = {
  ...CONTENT_TYPE,
};

//TODO: Mirar si hay que meter aquí el accessToken porque ya aparece en swagger sin meterlo aquí
export const UPDATE_EVENT_HEADERS = { ...CONTENT_TYPE, ACCESS_TOKEN };
