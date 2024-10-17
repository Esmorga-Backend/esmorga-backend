import { SessionDto } from '../../infrastructure/dtos';

/**
 * Return the id related to the oldest created/refreshed futher in the past pair of tokens
 * @param tokensData Pair of tokens information (accessToken, refreshToken, createdAt, updatedAt)
 * @returns Id related to the oldest pair of tokens
 */
export function getOldestSession(tokensData: SessionDto[]) {
  const oldersCreatedAt = tokensData.reduce((acc, tokenData) =>
    tokenData.createdAt < acc.createdAt ? tokenData : acc,
  );

  const oldersUpdatedAt = tokensData.reduce((acc, tokenData) =>
    tokenData.updatedAt < acc.updatedAt ? tokenData : acc,
  );

  return oldersCreatedAt.createdAt < oldersUpdatedAt.updatedAt
    ? oldersCreatedAt.id
    : oldersUpdatedAt.id;
}
