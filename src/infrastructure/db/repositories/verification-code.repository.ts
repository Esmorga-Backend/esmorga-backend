import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { VerificationCode as VerificationCodeSchema } from '../schema';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class VerificationCodeRepository extends MongoRepository<VerificationCodeSchema> {
  constructor(
    @InjectModel(VerificationCodeSchema.name)
    private verificationCodeModel: Model<VerificationCodeSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(verificationCodeModel);
  }

  /**
   * Find a verificationCode document related to the email and update the code. If there is not document
   * creates a new one.
   *
   * @param verificationCode - 6 random digits value
   * @param email - User email
   * @param requestId - Request identifier for API logger
   */
  async saveCode(verificationCode: number, email: string, requestId?: string) {
    try {
      this.logger.info(
        `[VeririficationCodeRepository] [saveCode] - x-request-id: ${requestId}`,
      );

      await this.findAndUpdateVerificationCode(verificationCode, email);
    } catch (error) {
      this.logger.error(
        `[VeririficationCodeRepository] [saveCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  // TODO add TsDoc
  async getCode(verificationCode: string, requestId?: string) {
    try {
      this.logger.info(
        `[VeririficationCodeRepository] [getCode] - x-request-id: ${requestId}`,
      );

      const verificationCodeData =
        await this.findOneByVerificationCode(verificationCode);

      return verificationCodeData;
    } catch (error) {
      this.logger.error(
        `[VeririficationCodeRepository] [getCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
