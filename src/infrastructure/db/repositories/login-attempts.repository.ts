import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { LoginAttempts as LoginAttemptsSchema } from '../schema';
import { DataBaseInternalError } from '../errors';

@Injectable()
export class LoginAttemptsRepository extends MongoRepository<LoginAttemptsSchema> {
  constructor(
    @InjectModel(LoginAttemptsSchema.name)
    private loginAttemptsModel: Model<LoginAttemptsSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(loginAttemptsModel);
  }

  /**
   * Updates the login attempts for a user identified by the uuid.
   *
   * @param uuid - User identifier.
   * @param requestId - Request identifier.
   * @returns The updated number of login attempts.
   */
  async updateLoginAttempts(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[LoginAttemptsRepository] [updateLoginAttempts] - x-request-id: ${requestId}`,
      );

      const attemptsUpdated = await this.findAndUpdateLoginAttempts(uuid);

      return attemptsUpdated.loginAttempts;
    } catch (error) {
      this.logger.error(
        `[LoginAttemptsRepository] [updateLoginAttempts] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
