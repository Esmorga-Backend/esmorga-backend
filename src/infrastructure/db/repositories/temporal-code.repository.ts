import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PinoLogger } from 'nestjs-pino';
import { Model } from 'mongoose';
import { MongoRepository } from './mongo.repository';
import { TemporalCode as TemporalCodeSchema } from '../schema';
import { DataBaseInternalError, DataBaseNotFoundError } from '../errors';

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
   * Find a verificationCode document related to the email and update the code.
   * If there is not document creates a new one.
   *
   * @param code - 6 random digits value.
   * @param codeType - Indicates the type of the code.
   * @param email - User email.
   * @param requestId - Request identifier for API logger.
   */
  async saveCode(
    code: string,
    codeType: string,
    email: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[TemporalCodeRepository] [saveCode] - x-request-id: ${requestId}`,
      );

      await this.findAndUpdateTemporalCode(code, codeType, email);
    } catch (error) {
      this.logger.error(
        `[TemporalCodeRepository] [saveCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Find the document which code value and type matchs with params
   *
   * @param code - VerificationCode or ForgotPasswordCode value.
   * @param codeType - Specification for code type.
   * @param requestId - Request identifier for API logger.
   * @returns Document data
   * @throws DataBaseNotFoundError - Document with that code and codeType not found.
   */
  async getCode(code: string, codeType: string, requestId?: string) {
    try {
      this.logger.info(
        `[TemporalCodeRepository] [getCode] - x-request-id: ${requestId}`,
      );

      const codeData = await this.findOneByCodeAndType(code, codeType);

      if (!codeData) throw new DataBaseNotFoundError();

      return codeData;
    } catch (error) {
      this.logger.error(
        `[TemporalCodeRepository] [getCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }
}
