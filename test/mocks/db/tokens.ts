import { SESSION_ID, USER_MOCK_DB_ID } from './common';

export const TTL_MOCK_DB = parseInt(process.env.ACCESS_TOKEN_TTL);

export const SESSION_MOCK_DB = {
  _id: 'id',
  uuid: USER_MOCK_DB_ID,
  sessionId: SESSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};
