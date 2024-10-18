import { Injectable, NotImplementedException } from '@nestjs/common';
import { PairOfTokensDto } from '../../../dtos/pair-of-tokens.dto';
/**
 * @deprecated Old tokens store
 */
@Injectable()
export class TokensDA {
  findOneByRefreshToken(
    _refreshToken: string,
  ): Promise<PairOfTokensDto | null> {
    throw new NotImplementedException();
  }
}
