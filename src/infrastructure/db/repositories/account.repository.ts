import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { AccountRegisterDto } from '../..//http/dtos';
import {
  DataBaseInternalError,
  DataBaseUnathorizedError,
  DataBaseUnprocesableContentError,
} from '../errors';
import { UserProfileDto } from '../../dtos';
import { validateObjectDto } from '../utils';
import { REQUIRED_DTO_FIELDS } from '../consts';
import { ACCOUNT_STATUS } from '../../../domain/const';
import { UserDA } from '../modules/none/user-da';

@Injectable()
export class AccountRepository {
  constructor(
    private userDA: UserDA,
    private readonly logger: PinoLogger,
    private configService: ConfigService,
  ) {}

  /**
   * Find an user by id.
   *
   * @param id - User identifier.
   * @param requestId - Request identifier.
   * @returns User data following business schema.
   * @throws DataBaseUnathorizedError - User not found.
   */
  async getUserById(id: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [getUserById] - x-request-id: ${requestId}, id: ${id}`,
      );

      const userProfile = await this.userDA.findOneById(id);

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
   * @returns User data following business schema.
   * @throws DataBaseUnathorizedError - User not found.
   */
  async getUserByEmail(
    email: string,
    requestId?: string,
  ): Promise<UserProfileDto> {
    try {
      this.logger.info(
        `[AccountRepository] [getUserByEmail] - x-request-id: ${requestId}, email: ${email}`,
      );

      const userProfile = await this.userDA.findOneByEmail(email);

      if (!userProfile) return null;

      validateObjectDto(userProfile, REQUIRED_DTO_FIELDS.USER_PROFILE);

      return userProfile;
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [getUserByEmail] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

      throw new DataBaseInternalError();
    }
  }

  /**
   * Finds the names of the users related to the provided array of uuid.
   *
   * @param uuids - Array of users uuid.
   * @param requestId - Request identifier.
   * @returns User data following business schema.
   */
  async getUserNames(uuids: string[], requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [getUserNames] - x-request-id: ${requestId}`,
      );

      const userProfiles = await this.userDA.findUsersByUuids(uuids);

      if (!userProfiles) return null;

      const userNames = userProfiles.map((user) => {
        validateObjectDto(user, REQUIRED_DTO_FIELDS.USER_PROFILE);
        const { name, lastName } = user;
        return `${name} ${lastName}`;
      });

      return userNames;
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [getUserNames] - x-request-id: ${requestId}, error: ${error}`,
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
   * @returns User profile data if exist.
   */
  async accountExist(
    email: string,
    requestId?: string,
  ): Promise<UserProfileDto> {
    try {
      this.logger.info(
        `[AccountRepository] [accountExist] - x-request-id: ${requestId}, email: ${email}`,
      );

      return this.userDA.findOneByEmail(email);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [accountExist] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Find an account by uuid and update the password with the value encoded provided
   *
   * @param uuid - User identifier.
   * @param currentPassword - User current password.
   * @param newPassword - User new password.
   * @param requestId - Request identifier.
   */
  async updateAccountPassword(
    uuid: string,
    currentPassword: string,
    newPassword: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[AccountRepository] [updateAccountPassword] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );

      const updatedPassword = await this.userDA.updatePasswordByUuid(
        uuid,
        currentPassword,
        newPassword,
      );

      if (!updatedPassword) throw new DataBaseUnprocesableContentError();
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [updateAccountPassword] - x-request-id: ${requestId}, error: ${error}`,
      );

      if (error instanceof HttpException) throw error;

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
  async updateAccountForgotPassword(
    email: string,
    password: string,
    requestId?: string,
  ) {
    try {
      this.logger.info(
        `[AccountRepository] [updateAccountForgotPassword] - x-request-id: ${requestId}, email: ${email}`,
      );

      return await this.userDA.updatePasswordByEmail(email, password);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [updateAccountForgotPassword] - x-request-id: ${requestId}, error: ${error}`,
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

      const userProfile = await this.userDA.updateStatusByEmail(
        email,
        ACCOUNT_STATUS.ACTIVE,
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
   * Update user status to ACTIVE to unblock it
   * and return the new status.
   *
   * @param email - User email address.
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema.
   */
  async unblockAccountByEmail(email: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [unblockAccountByEmail] - x-request-id: ${requestId}, email: ${email}`,
      );
      const userProfile = await this.userDA.updateStatusByEmail(
        email,
        ACCOUNT_STATUS.ACTIVE,
      );
      return userProfile.status;
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [unblockAccountByEmail] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Update status to BLOCKED.
   *
   * @param uuid - User identifier..
   * @param requestId - Request identifier.
   * @returns UserProfileDto - User data following business schema.
   */
  async blockAccountByUuid(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [blockAccountByUuid] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );

      const userTimeBlock = this.configService.get('LOGIN_ATTEMPTS_TTL') * 1000;

      const unblockDate = new Date(Date.now() + userTimeBlock);

      await this.userDA.updateBlockedStatusByUuid(
        uuid,
        ACCOUNT_STATUS.BLOCKED,
        unblockDate,
      );
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [blockAccountByUuid] - x-request-id: ${requestId}, error: ${error}`,
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
      await this.userDA.create(userData);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [saveUser] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }

  /**
   * Delete account by UUID.
   *
   * @param uuid - User identifier..
   * @param requestId - Request identifier.
   */
  async deleteAccountByUuid(uuid: string, requestId?: string) {
    try {
      this.logger.info(
        `[AccountRepository] [deleteAccountByUuid] - x-request-id: ${requestId}, uuid: ${uuid}`,
      );

      await this.userDA.deleteByUuid(uuid);
    } catch (error) {
      this.logger.error(
        `[AccountRepository] [deleteAccountByUuid] - x-request-id: ${requestId}, error: ${error}`,
      );

      throw new DataBaseInternalError();
    }
  }
}
