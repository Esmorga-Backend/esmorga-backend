import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { TokensDA } from '../none/tokens-da';
import { Tokens } from './schema';
import { PairOfTokensDto } from '../../../dtos/pair-of-tokens.dto';

/**
 * @deprecated Old tokens store
 */
@Injectable({})
export class TokensMongoDA implements TokensDA {
  constructor(@InjectModel(Tokens.name) private tokensModel: Model<Tokens>) {}
  async findOneByRefreshToken(
    refreshToken: string,
  ): Promise<PairOfTokensDto | null> {
    const tokensDoc = await this.tokensModel.findOne({
      refreshToken: { $eq: refreshToken },
    });
    return plainToClass(PairOfTokensDto, tokensDoc, {
      excludeExtraneousValues: true,
    });
  }
}
