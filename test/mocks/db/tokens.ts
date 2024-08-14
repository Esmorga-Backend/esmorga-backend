import { USER_MOCK_DB_ID } from './common';

export const TTL_MOCK_DB = parseInt(process.env.ACCESS_TOKEN_TTL);

export const PAIR_OF_TOKENS_MOCK_DB = {
  _id: 'id',
  uuid: USER_MOCK_DB_ID,
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  createdAt: new Date(),
  updatedAt: new Date(),
};
