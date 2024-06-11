import { PairOfTokensDto } from '../../infrastructure/dtos';

export function getOldestPairOfTokens(tokensData: PairOfTokensDto[]) {
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
