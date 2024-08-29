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

  async saveCode(code: number, email: string, requestId?: string) {
    try {
      this.logger.info(
        `[VeririficationCodeRepository] [saveCode] - x-request-id: ${requestId}`,
      );

      await this.findAndUpdateVerificationCode(code, email);
    } catch (error) {
      this.logger.error(
        `[VeririficationCodeRepository] [saveCode] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
