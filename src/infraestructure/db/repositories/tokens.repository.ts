import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MongoRepository } from './mongo.repository';
import { Tokens as TokensSchema } from '../schema';
import { DataBaseInternalError } from '../errors';
import { PairOfTokensDTO } from '../../dtos';

@Injectable()
export class TokensRepository extends MongoRepository<TokensSchema> {
  constructor(
    @InjectModel(TokensSchema.name) private tokensModel: Model<TokensSchema>,
  ) {
    super(tokensModel);
  }

  async saveTokens(uuid: string, accessToken: string, refreshToken: string) {
    try {
      await this.save({ uuid, accessToken, refreshToken });
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }

  async getAllTokensByUuid(uuid: string) {
    try {
      const tokensData = await this.findByUuid(uuid);

      const pairOfTokens: PairOfTokensDTO[] = tokensData.map((data) => {
        return plainToClass(PairOfTokensDTO, data, {
          excludeExtraneousValues: true,
        });
      });

      return pairOfTokens;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
