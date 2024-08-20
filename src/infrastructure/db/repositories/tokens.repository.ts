import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { Tokens as TokensSchema } from '../schema';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { PairOfTokensDto } from '../../dtos';

@Injectable()
export class TokensRepository extends MongoRepository<TokensSchema> {
  constructor(
    @InjectModel(TokensSchema.name) private tokensModel: Model<TokensSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(tokensModel);
  }

  /**
   * Store a new pair of tokens for the user requested them.
   *
   * @param uuid - User identifier.
   * @param accessToken - Access token to be saved.
   * @param refreshToken Refresh token to be saved.
   * @param requestId - Request identifier for API logger
   */
  async saveTokens(
    uuid: string,
    accessToken: string,
    refreshToken: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[TokensRepository] [saveTokens] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );

      const pairOfTokens = new this.tokensModel({
        uuid,
        accessToken,
        refreshToken,
      });

      await this.save(pairOfTokens);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [saveTokens] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get all tokens generated for the user with that uuid/id.
   *
   * @param uuid - User identifier.
   * @param requestId - Request identifier for API logger.
   * @returns PairOfTokensDto[] - Array with tokens pairs.
   */
  async getAllTokensByUuid(
    uuid: string,
    requestId?: string,
  ): Promise<PairOfTokensDto[]> {
    try {
      this.logger.info(
        `[TokensRepository] [getAllTokensByUuid] - x-request-id: ${requestId}, uuid: ${uuid}`,
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
        `[TokensRepository] [getAllTokensByUuid] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get pair of tokens with user id related to the refresh provided.
   *
   * @param refreshToken - Refresh token stored.
   * @param requestId - Request identifier for API logger.
   * @returns PairOfTokensDto - Pair of tokens and user id.
   */
  async getPairOfTokensByRefreshToken(
    refreshToken: string,
    requestId?: string,
  ): Promise<PairOfTokensDto> {
    try {
      this.logger.info(
        `[TokensRepository] [getPairOfTokensByRefreshToken] - x-request-id:${requestId}, refreshToken ${refreshToken}`,
      );

      const tokenData = await this.findOneByRefreshToken(refreshToken);

      if (!tokenData) throw new DataBaseUnathorizedError();

      const pairOfTokens = plainToClass(PairOfTokensDto, tokenData, {
        excludeExtraneousValues: true,
      });

      return pairOfTokens;
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [getPairOfTokensByRefreshToken] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Get pair of tokens with user id related to the access provided.
   *
   * @param acessToken - Access token stored.
   * @param requestId - Request identifier for API logger.
   * @returns PairOfTokensDto - Pair of tokens and user id.
   */
  async getPairOfTokensByAccessToken(
    acessToken: string,
    requestId?: string,
  ): Promise<PairOfTokensDto> {
    try {
      this.logger.info(
        `[TokensRepository] [getPairOfTokensByAcessToken] - x-request-id: ${requestId}`,
      );

      const tokenData = await this.findOneByAccessToken(acessToken);

      if (!tokenData) throw new DataBaseUnathorizedError();

      const pairOfTokens = plainToClass(PairOfTokensDto, tokenData, {
        excludeExtraneousValues: true,
      });

      return pairOfTokens;
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [getPairOfTokensByAcessToken] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Remove pair of tokens document by document's ID.
   * @param id - Document identifier.
   * @param requestId - Request identifier for API logger.
   */
  async removeTokensById(id: string, requestId?: string) {
    try {
      this.logger.info(
        `[TokensRepository] [removeTokensById] - x-request-id: ${requestId}, tokensId: ${id}`,
      );

      await this.removeById(id);
    } catch (error) {
      this.logger.error(
        `[TokensRepository] [removeTokensById] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
