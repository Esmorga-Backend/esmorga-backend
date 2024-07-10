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
    example:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjY4NDBmYjM3MDNlZTQxY2U2MGIzZGViIiwiaWF0IjoxNzIwMTY2ODMxLCJleHAiOjE3MjAxNjc0MzF9.Y8vpkTnsI5ry3hMbVVazeNQaZ0NDKqOQP3yEwJ1xhNu',
  },
};
