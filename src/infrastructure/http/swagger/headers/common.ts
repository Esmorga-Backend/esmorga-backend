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

export const AUTHORIZATION_BEARER_OPTIONAL = {
  name: 'Authorization',
  description: 'Bearer accessToken',
  required: false,
  schema: {
    type: 'string',
    example: 'Bearer accessToken',
  },
};
