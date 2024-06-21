export const TTL_MOCK_DB = parseInt(process.env.ACCESS_TOKEN_TTL);

export const PAIR_OF_TOKENS_MOCK_DB = {
  _id: 'id',
  uuid: 'uuid',
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  createdAt: new Date(),
  updatedAt: new Date(),
};
