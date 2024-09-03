import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../..//http/dtos';
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

  /**
   * Find a user by email but doesn't throw an error if not found.
   *
   * @param email - User email.
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema if found.
   */
  async findUserByEmail(email: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [findUserByEmail] - x-request-id: ${requestId}, email: ${email}`,
      );

      const user = await this.findOneByEmail(email);

      if (user) {
        const userProfile: UserProfileDto = plainToClass(UserProfileDto, user, {
          excludeExtraneousValues: true,
        });

        validateObjectDto(userProfile, REQUIRED_DTO_FIELDS.USER_PROFILE);

        return userProfile.email;
      }
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [findUserByEmail] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Find an user by id.
   *
   * @param id - User identifier.
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema.
   * @throws DataBaseUnathorizedError - User not found.
   */
  async getUserById(id: string, requestId?: string): Promise<UserProfileDto> {
    try {
      this.logger.info(
        `[AccountRepository] [getUserById] - x-request-id: ${requestId}, id: ${id}`,
      );

      const user = await this.findOneById(id);

      const userProfile: UserProfileDto = plainToClass(UserProfileDto, user, {
        excludeExtraneousValues: true,
      });

      if (!userProfile) throw new DataBaseUnathorizedError();

      validateObjectDto(userProfile, REQUIRED_DTO_FIELDS.USER_PROFILE);

      return userProfile;
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [getUserById] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Find an user by email.
   *
   * @param email - User email.
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema.
   * @throws DataBaseUnathorizedError - User not found.
   */
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

  /**
   * Create a new user document with the data provided.
   *
   * @param userData - DTO with user data provided to store.
   * @param requestId - Request identifier.
   * @throws DataBaseConflictError - Email already stored
   */
  async saveUser(userData: AccountRegisterDto, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [saveUser] - x-request-id: ${requestId}, email: ${userData.email}`,
      );

      const user = new this.userModel(userData);

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
