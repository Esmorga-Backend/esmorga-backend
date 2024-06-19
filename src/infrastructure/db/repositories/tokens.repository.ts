import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { Tokens as TokensSchema } from '../schema';
import { DataBaseInternalError } from '../errors';
import { PairOfTokensDto } from '../../dtos';

@Injectable()
export class TokensRepository extends MongoRepository<TokensSchema> {
  constructor(
    @InjectModel(TokensSchema.name) private tokensModel: Model<TokensSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(tokensModel);
  }

  async saveTokens(
    uuid: string,
    accessToken: string,
    refreshToken: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[TokensRepository] [saveTokens] - x-request-id:${requestId}, accessToken ${accessToken}`,
      );

      const pairOfTokens = new this.tokensModel({
        uuid,
        accessToken,
        refreshToken,
      });

      await this.save(pairOfTokens);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [saveTokens] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async getAllTokensByUuid(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[TokensRepository] [getAllTokensByUuid] - x-request-id:${requestId}, uuid ${uuid}`,
      );

      const tokensData = await this.findByUuid(uuid);

      const pairOfTokens: PairOfTokensDto[] = tokensData.map((data) => {
        return plainToClass(PairOfTokensDto, data, {
          excludeExtraneousValues: true,
        });
      });

      return pairOfTokens;
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [getAllTokensByUuid] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  async removeTokensById(id: string, requestId?: string) {
    try {
      this.logger.info(
        `[TokensRepository] [removeTokensById] - x-request-id:${requestId}, tokensId ${id}`,
      );

      await this.removeById(id);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [removeTokensById] - x-request-id:${requestId}, error ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
