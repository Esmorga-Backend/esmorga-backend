import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { LoginAttemps as LoginAttempsSchema } from '../schema';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class LoginAttempsRepository extends MongoRepository<LoginAttempsSchema> {
  constructor(
    @InjectModel(LoginAttempsSchema.name)
    private loginAttempsModel: Model<LoginAttempsSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(loginAttempsModel);
  }

  async updateLoginAttemps(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[LoginAttempsRepository] [updateLoginAttemps] - x-request-id: ${requestId}`,
      );

      const attempsUpdated = await this.findAndUpdateLoginAttemps(uuid);

      return attempsUpdated.loginAttempts;
    } catch (error) {
      this.logger.error(
        `[LoginAttempsRepository] [updateLoginAttemps] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
