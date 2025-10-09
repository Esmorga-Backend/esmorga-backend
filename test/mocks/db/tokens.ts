import { SESSION_ID, USER_MOCK_DB_ID, REFRESH_TOKEN_ID } from './common';

export const SESSION_MOCK_DB = {
  _id: 'id',
  uuid: USER_MOCK_DB_ID,
  sessionId: SESSION_ID,
  refreshTokenId: REFRESH_TOKEN_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
};
