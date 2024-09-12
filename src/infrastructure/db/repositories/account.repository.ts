import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../..//http/dtos';
import { MongoRepository } from './mongo.repository';
import { User as UserSchema } from '../schema';
import { DataBaseInternalError, DataBaseUnathorizedError } from '../errors';
import { UserProfileDto } from '../../dtos';
import { validateObjectDto } from '../services';
import { REQUIRED_DTO_FIELDS } from '../consts';
import { ACCOUNT_STATUS } from '../../../domain/const';

@Injectable()
export class AccountRepository extends MongoRepository<UserSchema> {
  constructor(
    @InjectModel(UserSchema.name) private userModel: Model<UserSchema>,
    private readonly logger: PinoLogger,
  ) {
    super(userModel);
  }

  /**
   * Find an user by id.
   *
   * @param id - User identifier.
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema.
   * @throws DataBaseUnathorizedError - User not found.
   */
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
   * Check if there is already an account with that email.
   *
   * @param email - User email.
   * @param requestId - Request identifier.
   * @returns Boolean
   */
  async accountExist(email: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [accountExist] - x-request-id: ${requestId}, email: ${email}`,
      );

      return this.findOneByEmail(email);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [accountExist] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Find an account by email and update the password with the value encoded provided
   *
   * @param email - User email.
   * @param password - User password to update.
   * @param requestId - Request identifier.
   */
  async updateAccountPassword(
    email: string,
    password: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[AccountRepository] [updateAccountPassword] - x-request-id: ${requestId}, email: ${email}`,
      );

      await this.updatePasswordByEmail(email, password);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [updateAccountPassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Update status to ACTIVE and return the document updated.
   *
   * @param email - User email address.
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema.
   */
  async activateAccountByEmail(
    email: string,
    requestId?: string,
  ): Promise<UserProfileDto> {
    try {
      this.logger.info(
        `[AccountRepository] [activateAccountByEmail] - x-request-id: ${requestId}, email: ${email}`,
      );

      const account = await this.updateStatusByEmail(
        email,
        ACCOUNT_STATUS.ACTIVE,
      );

      const userProfile: UserProfileDto = plainToClass(
        UserProfileDto,
        account,
        {
          excludeExtraneousValues: true,
        },
      );

      validateObjectDto(userProfile, REQUIRED_DTO_FIELDS.USER_PROFILE);

      return userProfile;
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [activateAccountByEmail] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Create a new user document with the data provided.
   *
   * @param userData - DTO with user data provided to store.
   * @param requestId - Request identifier.
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

      throw new DataBaseInternalError();
    }
  }
}
