export const ACCESS_TOKEN = {
  name: 'Authorization',
  description: 'Bearer accessToken',
};

export const CONTENT_TYPE = {
  name: 'Content-Type',
  description: 'application/json',
};

export const AUTHORIZATION_BEARER = {
  name: 'Authorization',
  description: 'Bearer accessToken',
  required: true,
  schema: {
    type: 'string',
    example: 'Bearer accessToken',
  },
};
