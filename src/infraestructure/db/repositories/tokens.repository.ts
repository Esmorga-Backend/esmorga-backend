import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { Tokens as TokensSchema } from '../schema';
import { DataBaseInternalError } from '../errors';

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
}
