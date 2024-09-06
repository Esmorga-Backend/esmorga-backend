import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { DataBaseInternalError } from '../errors';
import { MongoRepository } from './mongo.repository';
import { TemporalCode as TemporalCodeSchema } from '../schema';

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
   * Store the email and the verification/forgot password code with a deadline.
   *
   * @param email - Email user identifier.
   * @param requestId - Request identifier for API logger.
   */
  async saveTemporalCode(
    email: string,
    temporalCode: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[TemporalCodeRepository] [saveTemporalCode] - x-request-id: ${requestId}`,
      );

      await this.findAndUpdateTemporalCode(temporalCode, email);
    } catch (error) {
      this.logger.error(
        `[TemporalCodeRepository] [saveTemporalCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
