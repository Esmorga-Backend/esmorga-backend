import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { MongoRepository } from './mongo.repository';
import { User as UserSchema } from '../schema';
import {
  DataBaseInternalError,
  DataBaseUnathorizedError,
  DataBaseConflictError,
} from '../errors';
import { UserProfileDto } from '../../dtos';
import { validateObjectDto } from '../services';
import { REQUIRED_DTO_FIELDS } from '../consts';

@Injectable()
export class AccountRepository extends MongoRepository<UserSchema> {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(userModel);
  }

  async getUserById(id: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [getUserById] - x-request-id: ${requestId}, id: ${id}`,
      );

      const user = await this.findOneById(id);

      const userProfile: UserProfileDto = plainToClass(UserProfileDto, user, {
        excludeExtraneousValues: true,
      });

      if (!userProfile) throw new DataBaseUnathorizedError();

      validateObjectDto(userProfile, REQUIRED_FIELDS.USER_PROFILE);

      return userProfile;
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [getUserById] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  async getUserByEmail(email: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [getUserByEmail] - x-request-id: ${requestId}, email: ${email}`,
      );

      const user = await this.findOneByEmail(email);

      const userProfile: UserProfileDto = plainToClass(UserProfileDto, user, {
        excludeExtraneousValues: true,
      });

      if (!userProfile) throw new DataBaseUnathorizedError();

      validateObjectDto(userProfile, REQUIRED_DTO_FIELDS.USER_PROFILE);

      return { userProfile, password: user.password };
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [getUserByEmail] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  async saveUser(data, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [saveUser] - x-request-id: ${requestId}, email: ${data.email}`,
      );

      const user = new this.userModel(data);

      await this.save(user);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [saveUser] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error.code === 11000) throw new DataBaseConflictError();

      throw new DataBaseInternalError();
    }
  }
}
