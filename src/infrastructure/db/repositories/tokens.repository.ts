import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { MongoRepository } from './mongo.repository';
import { Tokens as TokensSchema } from '../schema';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { PairOfTokensDto } from '../../dtos';

@Injectable()
export class TokensRepository extends MongoRepository<TokensSchema> {
  constructor(
    @InjectModel(TokensSchema.name) private tokensModel: Model<TokensSchema>,
  ) {
    super(tokensModel);
  }

  async saveTokens(uuid: string, accessToken: string, refreshToken: string) {
    try {
      const pairOfTokens = new this.tokensModel({
        uuid,
        accessToken,
        refreshToken,
      });

      await this.save(pairOfTokens);
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }

  async getAllTokensByUuid(uuid: string): Promise<PairOfTokensDto[]> {
    try {
      const tokensData = await this.findByUuid(uuid);

      const pairOfTokens: PairOfTokensDto[] = tokensData.map((data) => {
        return plainToClass(PairOfTokensDto, data, {
          excludeExtraneousValues: true,
        });
      });

      return pairOfTokens;
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }

  async getPairOfTokensByRefreshToken(
    refreshToken: string,
  ): Promise<PairOfTokensDto> {
    try {
      const tokenData = await this.findOneByRefreshToken(refreshToken);

      if (!tokenData) throw new DataBaseUnathorizedError();

      const pairOfTokens = plainToClass(PairOfTokensDto, tokenData, {
        excludeExtraneousValues: true,
      });

      return pairOfTokens;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  async removeTokensById(id: string) {
    try {
      await this.removeById(id);
    } catch (error) {
      throw new DataBaseInternalError();
    }
  }
}
