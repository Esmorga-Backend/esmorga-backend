import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { TemporalCode as TemporalCodeSchema } from '../schema';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class TemporalCodeRepository extends MongoRepository<TemporalCodeSchema> {
  constructor(
    @InjectModel(TemporalCodeSchema.name)
    private temporalCodeModel: Model<TemporalCodeSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(temporalCodeModel);
  }

  /**
   * Find a verificationCode document related to the email and update the code. If there is not document
   * creates a new one.
   *
   * @param code - 6 random digits value
   * @param email - User email
   * @param requestId - Request identifier for API logger
   */
  async saveCode(code: number, email: string, requestId?: string) {
    try {
      this.logger.info(
        `[TemporalCodeRepository] [saveCode] - x-request-id: ${requestId}`,
      );

      await this.findAndUpdateTemporalCode(code, email);
    } catch (error) {
      this.logger.error(
        `[TemporalCodeRepository] [saveCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  // TODO add TsDoc
  async getCode(verificationCode: string, requestId?: string) {
    try {
      this.logger.info(
        `[TemporalCodeRepository] [getCode] - x-request-id: ${requestId}`,
      );

      const verificationCodeData =
        await this.findOneByVerificationCode(verificationCode);

      return verificationCodeData;
    } catch (error) {
      this.logger.error(
        `[TemporalCodeRepository] [getCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
