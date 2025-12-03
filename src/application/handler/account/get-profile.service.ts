import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { plainToInstance } from 'class-transformer';
import { ProfileDto } from '../../../infrastructure/dtos';
import {
  AccountRepository,
  SessionRepository,
} from '../../../infrastructure/db/repositories';
import { DataBaseUnauthorizedError } from '../../../infrastructure/db/errors';
import { InvalidTokenApiError } from '../../../domain/errors';

@Injectable()
export class GetProfileService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly accountRepository: AccountRepository,
    private readonly tokensRepository: SessionRepository,
  ) {}

  /**
   * Provide the profile information of an user authenticated.
   *
   * @param sessionId - Client session id.
   * @param requestId - Request id.
   * @returns UserProfileDto - Object containing the user profile.
   */
  async getProfile(sessionId: string, requestId?: string): Promise<ProfileDto> {
    try {
      this.logger.info(
        `[GetProfileService] [getProfile] - x-request-id: ${requestId}`,
      );

      const { uuid } = await this.tokensRepository.getBySessionId(
        sessionId,
        requestId,
      );

      const userProfile = await this.accountRepository.getUserById(
        uuid,
        requestId,
      );

      if (!userProfile) {
        throw new DataBaseUnauthorizedError();
      }

      const profileDto: ProfileDto = plainToInstance(ProfileDto, userProfile, {
        excludeExtraneousValues: true,
      });

      return profileDto;
    } catch (error) {
      this.logger.error(
        `[GetProfileService] [getProfile] - x-request-id: ${requestId}, error ${error}`,
      );

      if (error instanceof DataBaseUnauthorizedError)
        throw new InvalidTokenApiError();

      throw error;
    }
  }
}
